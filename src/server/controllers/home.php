<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Home extends CI_Controller {

    public function index()
    {
        $this->load->model('gen/Users_model');
        $current_user = $this->Users_model->current_user();

        if ($current_user)
        {
            $this->load->view('home', array('user' => $current_user));
        }
    }

}