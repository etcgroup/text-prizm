<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Triage extends Base_Controller {

    public function index()
    {
        $user = $this->ensure_user();

        $data = array(
            'page_title' => 'Triage'
        );

        $this->render($data);
    }

}