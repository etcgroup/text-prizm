<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Gen extends API_Controller {

    function __construct()
    {
        parent::__construct();
    }

    // USERS

    function user_get()
    {
        if (!$this->get('id'))
        {
            $this->response(array('error' => 'No id provided'), 400);
        }

        $this->load->model('gen/Users_model');
        $data = $this->Users_model->get($this->get('id'));

        if ($data)
        {
            $this->response($data, 200);
        }
        else
        {
            $this->response(array('error' => 'User could not be found'), 404);
        }
    }

    function users_get()
    {
        $this->load->model('gen/Users_model');

        $filter = $this->build_filter($this->get(), array('name_like'));
        $data = $this->Users_model->get_all($filter);

        if ($data)
        {
            $this->response($data, 200); // 200 being the HTTP response code
        }
        else
        {
            $this->response(array('error' => 'Users could not be found'), 404);
        }
    }

}
