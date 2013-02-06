<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Dashboard extends Base_Controller {

    public function index()
    {
        $current_url = current_url();
        $ends_with_dashboard = strlen($current_url) - strrpos($current_url, 'dashboard') === strlen('dashboard');
        if ($ends_with_dashboard) {
            redirect('/', 'location');
        }

        $user = $this->ensure_user();

        $data = array(
            'page_title' => 'Dashboard'
        );

        $this->render($data);
    }

}