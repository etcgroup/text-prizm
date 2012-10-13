<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Base_model extends CI_Model {

    var $table;

    function __construct()
    {
        parent::__construct();
    }

    function get($id)
    {
        $query = $this->db->get_where($this->table, array('id' => $id));
        return $query->row();
    }

    function get_all($filter = array(), $unquoted_filter = array())
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

        if (count($unquoted_filter) > 0)
        {
            $this->db->where($unquoted_filter, NULL, false);
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

    function insert_data($data)
    {
        if ($this->db->insert($this->table, $data))
        {
            //Get the newly inserted id
            if (is_array($data))
            {
                $data['id'] = $this->db->insert_id();
                return (object) $data;
            }
            else
            {
                $data->id = $this->db->insert_id();
                return $data;
            }
        }
    }

    function update_data($id, $data)
    {
        $this->db->where('id', $id);
        if ($this->db->update($this->table, $data))
        {
            return $this->get($id);
        }
    }

    function delete($id)
    {
        $this->db->where('id', $id);
        return $this->db->delete($this->table);
    }

    function db_now()
    {
        return date('Y-m-d H:i:s', time());
    }

}
