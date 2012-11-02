<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Codebrowser extends CI_Controller {

    function __construct()
    {
        parent::__construct();
    }

    public function index()
    {
        $this->load->model('gen/Users_model');
        $this->load->model('coding/Codes_model');

        $current_user = $this->Users_model->current_user();
        if ($current_user)
        {
            $filter = array("schema_id" => 2);
            $codes = $this->Codes_model->get_all($filter);
            foreach ($codes as $code)
            {
                $code->counts = $this->get_counts($code->id, $current_user->id);
            }
            $this->load->view('codebrowser_table', array('codes' => $codes));
        }
    }

    private function get_counts($code, $uid)
    {
        $fua = $this->db->query("select count(distinct coding_instances.message_id) as count from coding_instances where flag=1 and code_id=$code	and message_id not in (select distinct message_id from coding_ratings)")->result();
        $fum = $this->db->query("select count(distinct coding_instances.message_id) as count from coding_instances where flag=1 and code_id=$code	and message_id not in (select distinct message_id from coding_ratings where user_id=$uid)")->result();
        $ft = $this->db->query("select count(distinct coding_instances.message_id) as count from coding_instances where flag=1 and code_id=$code")->result();
        $t = $this->db->query("select count(distinct coding_instances.message_id) as count from coding_instances where code_id=$code")->result();
        return array("fua" => $fua[0]->count, "fum" => $fum[0]->count, "ft" => $ft[0]->count, "t" => $t[0]->count);
    }

    public function examples($which, $code = "", $limit = 15, $before = 5, $after = null)
    {

        $this->load->model('gen/Users_model');
        $this->load->model('coding/Codes_model');

        if (array_key_exists('REMOTE_USER', $_SERVER))
        {
            $username = $_SERVER['REMOTE_USER'];
        }
        else if (array_key_exists('PHP_AUTH_USER', $_SERVER))
        {
            $username = $_SERVER['PHP_AUTH_USER'];
        }
        else
        {
            $username = "";
        }

        $current_user = $this->Users_model->get_by_name($username);
        if (!$current_user)
        {
            header('WWW-Authenticate: Basic realm="No password required."');
            header('HTTP/1.0 401 Unauthorized');
            echo 'You must enter a registered netid. No password required';
            return;
        }
        else
        {
            if ($which != "random" && $which != "flagged")
                $which = "best";
            $schema_id = 1;

            if (is_numeric($code))
            {
                $codeModel = $this->Codes_model->get($code);
                $codeName = $codeModel->name;
            }
            else
            {
                $codeName = $code;
            }

            if ($after == null)
                $after = $before;
            if (!is_numeric($before) || $before <= 0)
                $before = 1;
            if (!is_numeric($after) || $after <= 0)
                $after = 1;
            if (!is_numeric($limit) || $limit <= 0)
                $limit = 0;
            $result = $this->examples_by_code($code, $limit, $which);
            $all = array();
            foreach ($result as $example)
            {
                $arr = array();
                $arr["id"] = $example->id;
                $arr["session_id"] = $example->session_id;
                $arr["conversation"] = $this->example_buffer($before, $example->time, $after, $example->session_id);
                $arr["rating"] = $example->rating;
                $arr["avgrating"] = $example->avgrating;
                $all[] = $arr;
            }
            $this->load->view('codebrowser', array('code_id' => $code, 'code' => $codeName, 'before' => $before, 'after' => $after, 'examples' => $all, 'user_id' => $current_user->id, 'number' => count($result), 'which' => str_replace("_", " ", $which)));
        }
    }

    private function examples_by_code($code, $limit, $type = "random")
    {
        $this->db->select('AVG(coding_ratings.rating) as avgrating, s.rating as rating, data_points.id, data_points.time, data_points.session_id');
        $this->db->from('data_points');
        $this->db->join('coding_instances', 'coding_instances.message_id = data_points.id');
        $this->db->join('coding_ratings', 'coding_ratings.message_id = data_points.id', 'left');
        $this->db->join('(select * from coding_ratings where user_id=2) s', 's.message_id = coding_ratings.message_id', 'left');
        $this->db->where('coding_instances.code_id', $code);
        if ($type == "flagged")
        {
            $this->db->where('coding_instances.flag', 1);
            $this->db->where('s.rating', NULL);
        }
        $this->db->group_by('data_points.id');
        if ($type == "best")
            $this->db->order_by('avgrating', 'desc');
        else
            $this->db->order_by('rand()');
        if ($limit > 0)
            $this->db->limit($limit);
        $query = $this->db->get();
        $result = $query->result();
        return $result;
    }

    private function example_buffer($before, $time, $after, $session_id)
    {
        $middle_time = strtotime($time);
        $before_time = $middle_time - (60 * $before);
        $after_time = $middle_time + (60 * $after);
        $this->db->select('data_points.id, data_points.time, data_participants.name as participant, data_points.message');
        $this->db->from('data_points');
        $this->db->join('data_participants', 'data_points.participant_id = data_participants.id');
        $this->db->where('data_points.session_id', $session_id);
        $this->db->where('data_points.time <=', date("Y-m-d H:i:s", $after_time));
        $this->db->where('data_points.time >=', date("Y-m-d H:i:s", $before_time));
        $query = $this->db->get();
        return $query->result();
    }

    public function rate($message, $user, $rating)
    {
        $data = array(
            'user_id' => $user,
            'message_id' => $message,
            'rating' => $rating,
            'updated' => date('Y-m-d H:i:s', time())
        );
        $query = $this->db->get_where('coding_ratings', array('message_id' => $message, 'user_id' => $user));
        $result = $query->result();
        if (count($result) > 0)
        {
            $this->db->where('user_id', $user);
            $this->db->where('message_id', $message);
            $this->db->update('coding_ratings', $data);
            echo "updated";
        }
        else if (!$this->db->insert('coding_ratings', $data))
        {
            echo "failed";
        }
        else
            echo "inserted";
    }

}

