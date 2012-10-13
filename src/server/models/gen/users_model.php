<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Users_model extends Base_model {

    var $table = 'users';

    function __construct()
    {
        parent::__construct();
    }

    function current_user()
    {
        $ci = & get_instance();
        if ($ci->input->get('username') !== false)
        {
            $username = $ci->input->get('username');
        }
        else if (array_key_exists('REMOTE_USER', $_SERVER))
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
            header('WWW-Authenticate: Basic realm="Test. No password required."');
            header('HTTP/1.0 401 Unauthorized');
            echo 'You must enter a registered netid. No password required';
            die;
        }

        return $current_user;
    }

    function get_by_name($username)
    {
        $query = $this->db->get_where($this->table, array('name' => $username));
        return $query->row();
    }

}

