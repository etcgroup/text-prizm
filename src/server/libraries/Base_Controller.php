<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Base_Controller extends CI_Controller {

    protected function ensure_user()
    {

    }

    protected function render($data = array(), $content_view = NULL)
    {

        if ($content_view === NULL)
        {
            $content_view = $this->router->fetch_class() . '/' . $this->router->fetch_method();
        }

        $data['page_title'] = 'Text Prizm: ' . $data['page_title'];

        $data['app_js'] = $this->router->fetch_class() . '/app';
        $data['app_css'] = $this->router->fetch_class() . '.css';

        $data['nav_menu'] = $this->load->view('templates/nav_menu', array('active_nav' => $this->router->fetch_class()), true);
        $data['footer'] = $this->load->view('templates/footer', $data, true);
        $data['main_content'] = $this->load->view($content_view, $data, true);
        
        $this->load->view('layouts/default', $data);
    }

}