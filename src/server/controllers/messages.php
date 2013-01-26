<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Messages extends Base_Controller {

    public function index()
    {
        $user = $this->ensure_user();

        $data = array(
            'page_title' => 'Messages'
        );

        $this->render($data);
    }

}