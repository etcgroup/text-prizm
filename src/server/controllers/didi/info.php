<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

/**
 * Didi REST API for monitoring distributed computation
 */
class Info extends API_Controller {

    /**
     * Create a new Didi API controller.
     */
    function __construct()
    {
        parent::__construct();
        $this->load->model('didi/didi_model');
    }

    function jobs_get()
    {
        $options = $this->get();
        $limit = 10;
        if (isset($options['limit']))
        {
            $limit = $options['limit'];
        }

        $jobs = $this->didi_model->get_jobs($limit);
        if (is_array($jobs))
        {
            $this->response($jobs, 200);
        }
        else
        {
            $this->response('Error getting jobs', 404);
        }
    }

    function machine_get()
    {
        $options = $this->get();
        $out = null;
        if (isset($options['id']))
        {
            $out = $this->didi_model->get_machine_by_id($options['id']);
        }
        else if (isset($options['location']))
        {
            $out = $this->didi_model->get_machine_by_location($options['location']);
        }
        else
        {
            $this->response('Insufficient data provided', 400);
        }
        if ($out == null)
        {
            $this->response('Machine not found', 404);
        }
        $this->response($out);
    }

    function machines_get()
    {
        $options = $this->get();
        $limit = 10;
        if (isset($options['limit']))
        {
            $limit = $options['limit'];
        }

        $machines = $this->didi_model->get_machines($limit);
        if (is_array($machines))
        {
            $this->response($machines, 200);
        }
        else
        {
            $this->response('Error getting machines', 404);
        }
    }

}