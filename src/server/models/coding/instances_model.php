<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Instances_model extends Base_model {

    var $table = 'coding_instances';

    function __construct()
    {
        parent::__construct();
        $this->load->library('options');
        $this->load->library('dates');
        $this->load->model('coding/codes_model');
        $this->load->model('gen/users_model');
    }

    /**
     * Inserts a new code instance.
     * @param type $code_id
     * @param type $message_id
     * @param type $user_id
     * @param type $task_id
     * @param type $intensity
     * @return type
     */
    function insert($code_id, $message_id, $user_id, $task_id = NULL, $intensity = NULL, $flag = 0)
    {
        $data = array(
            'code_id' => $code_id,
            'message_id' => $message_id,
            'user_id' => $user_id,
            'added' => $this->db_now(),
            'flag' => $flag
        );
        if ($task_id)
            $data['task_id'] = $task_id;
        if ($intensity)
            $data['intensity'] = $intensity;

        $data = $this->insert_data($data);
        if ($data)
        {
            $CI = & get_instance();
            $CI->load->model('coding/Codes_model');
            $CI->Codes_model->increment_instances($code_id);
            return $data;
        }
    }

    function get_all_for_message($message_id)
    {
        $this->db->where('message_id', $message_id);

        $instances = $this->db->get($this->table)->result();

        foreach ($instances as &$instance)
        {
            $this->_fill_in($instance);
        }

        return $instances;
    }

    function get_all_for_points($filter = array(), $points_filter = array(), $codes_filter = array())
    {
        $count = false;

        if (key_exists('count', $filter))
        {
            $count = true;
            unset($filter['count']);
        }

        $grid = false;
        if (key_exists('grid', $filter))
        {
            $grid = true;
            unset($filter['grid']);
        }


        if (key_exists('order_by', $filter))
        {
            $order_by = $filter['order_by'];
            unset($filter['order_by']);

            if (!$count)
            {
                $this->db->order_by($order_by);
            }
        }

        if (key_exists('limit', $filter))
        {
            $limit = $filter['limit'];
            $offset = 0;
            unset($filter['limit']);

            if (key_exists('offset', $filter))
            {
                $offset = $filter['offset'];
                unset($filter['offset']);
            }

            $this->db->limit($limit, $offset);
        }


        if (count($filter) > 0)
        {
            $this->db->where($filter);
        }

        if (count($points_filter) > 0)
        {
            $this->db->where($points_filter);
            $this->db->join('data_points', 'data_points.id = message_id');
        }

        if (count($codes_filter) > 0)
        {
            $this->db->where($codes_filter);
            $this->db->join('coding_codes', 'coding_codes.id = code_id');
        }

        $this->db->select($this->table . '.*');
        $this->db->from($this->table);

        if ($grid)
        {
            $query = $this->db->get();
            $fields = $query->field_data();
            $count = $this->db->count_all_results($this->table);

            return array('totalrows' => $count, 'cols' => $fields, 'data' => $query->result());
        }
        else if ($count)
        {
            $count = $this->db->count_all_results();
            return array('count' => $count);
        }
        else
        {
            $query = $this->db->get();
            return $query->result();
        }
    }

    function delete($id)
    {
        $instance = $this->get($id);

        if (parent::delete($id))
        {

            $CI = & get_instance();
            $CI->load->model('coding/Codes_model');
            if ($CI->Codes_model->decrement_instances($instance->code_id))
            {
                return TRUE;
            }
        }
    }

    function clear_schema($schema_id)
    {
        //Make it impossible to delete the important codes
        if ($schema_id == 2)
            return FALSE;


        $result = $this->db->query('DELETE `coding_instances`
            FROM `coding_instances`, `coding_codes`
            WHERE coding_instances.code_id = coding_codes.id
            AND coding_codes.schema_id = ' . $schema_id);

        if ($result)
        {

            //Now delete the old codes
            $this->db->where('schema_id', $schema_id);
            return $this->db->delete('coding_codes');
        }
    }

    /**
     * Fills in the missing instance data (user, code, etc.)
     * The object is modified in place.
     *
     * @param object $instance A code instance data object straight from the database.
     *
     * @return NULL
     */
    private function _fill_in($instance)
    {
        $instance->added = $this->dates->php_datetime($instance->added)->getTimestamp();
        $instance->user = $this->users_model->get($instance->user_id);
        $instance->code = $this->codes_model->get($instance->code_id);
        unset($instance->code_id);
        unset($instance->user_id);
    }

}
