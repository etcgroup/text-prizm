<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

/**
 * Didi REST API for using distributed computing resources
 */
class Comp extends API_Controller {

    /**
     * Create a new Didi API controller.
     */
    function __construct() {
        parent::__construct();
        $this->load->library('didi');
        $this->load->library('options');
        $this->load->library('dates');
        $this->load->model('didi/didi_model');
    }

    /**
     * Returns a task to work on, as a JSON object. No parameters
     *
     * @return NULL
     */
    function task_get() {
        $this->response($this->didi->next_task());
    }
    
    function job_post(){
        // this is a post method because backbone is dump and thinks post is create
        $options = $this->post();
        if (!$this->options->has_keys($options, array('description', 'task_list'))) {
            $this->response('Insufficient data provided', 400);
        }
        $tasks = $options['task_list'];
        $task_id_list = array();
        foreach($tasks as $task){
            $task_id_list[] = $this->didi_model->create_task($task);
        }
        $id = $this->didi_model->create_job($options['description'], $task_id_list);
        $this->response($this->didi_model->get_job($id));
    }

    function machine_put() {
        $options = $this->put();
        if (!$this->options->has_keys($options, array('location', 'name', 'types'))) {
            $this->response('Insufficient data provided', 400);
        }
        $machine = $this->didi_model->create_machine(
                $options['location'], $options['name'], json_decode($options['types']));
        if ($machine == null) {
            $this->response('A machine already exists at this location.', 400);
        }
        $this->response($machine);
    }

    function machine_post() {
        $options = $this->post();
        $id = isset($options['id']) ? $options['id'] : null;
        $location = isset($options['location']) ? $options['loation'] : null;
        if (!isset($options['name']) || ($id == null && $location == null)) {
            $this->response('Insufficient parameters', 400);
        }
        $this->didi_model->refresh_machine($id, $location);

        $out = null;
        if (isset($options['id'])) {
            $out = $this->didi_model->get_machine_by_id($options['id']);
        } else if (isset($options['location'])) {
            $out = $this->didi_model->get_machine_by_location($options['location']);
        }
        if ($out == null) {
            $this->response('No such machine found.', 404);
        }
        $this->response($out);
    }

    function available_post() {
        $options = $this->post();
        $locations = array();
        if (isset($options['locations'])) {
            $locations = json_decode($options['locations']);
        } else if (isset($options['location'])) {
            $locations[] = $options['location'];
        } else {
            $this->response('No location(s) provided', 400);
        }
        $this->response($this->didi_model->set_machine_busyness($locations, false));
    }

    function busy_post() {
        $options = $this->post();
        $locations = array();
        if (isset($options['locations'])) {
            $locations = json_decode($options['locations']);
        } else if (isset($options['location'])) {
            $locations[] = $options['location'];
        } else {
            $this->response('No location(s) provided', 400);
        }
        $this->response($this->didi_model->set_machine_busyness($locations, true));
    }
    
    function task_post(){
        
    }

}