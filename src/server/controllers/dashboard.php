<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Dashboard extends Base_Controller {

    public function index()
    {
        $user = $this->ensure_user();

        $data = array(
            'page_title' => 'Dashboard'
        );

        $this->render($data);
    }

}