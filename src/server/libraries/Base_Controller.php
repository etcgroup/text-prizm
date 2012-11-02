<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Base_Controller extends CI_Controller {

    protected function ensure_user()
    {
        $this->load->model('gen/Users_model');
        $current_user = $this->Users_model->current_user();
        return $current_user;
    }

    /**
     * A generic render method that accepts data and
     * an optional content view name.
     *
     * The content view defaults to the current controller/method.
     *
     * @param type $data
     * @param string $content_view
     */
    protected function render($data = array(), $content_view = NULL)
    {

        if ($content_view === NULL)
        {
            // Set the content view if none was provided, to controller/method
            $content_view = $this->router->fetch_class() . '/' . $this->router->fetch_method();
        }

        // Augment the provided title with
        if (array_key_exists('page_title', $data))
        {
            $data['page_title'] = $this->config->item('name') . ': ' . $data['page_title'];
        }
        else
        {
            $data['page_title'] = $this->config->item('name');
        }

        // Get the app javascript and css references
        $data['app_js'] = $this->router->fetch_class() . '/app';
        $data['app_css'] = $this->router->fetch_class() . '.css';

        // Generate the nav menu and footer
        $data['nav_menu'] = $this->load->view('templates/nav_menu', array('active_nav' => $this->router->fetch_class()), true);
        $data['footer'] = $this->load->view('templates/footer', $data, true);

        // Generate the main page content
        $data['main_content'] = $this->load->view($content_view, $data, true);

        // Load the layout with the subsections & data
        $this->load->view('layouts/default', $data);
    }

}