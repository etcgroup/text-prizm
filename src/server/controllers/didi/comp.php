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
    
    
    function available_post(){
        $options = $this->post();
        $locations = array();
        if(isset($options['locations'])) {
            $locations = json_decode($options['locations']);
        }
        else if(isset($options['location'])) {
            $locations[] = $options['location'];
        }
        else {
            $this->response('No location(s) provided', 400);
        }
        $this->response($this->didi_model->set_machine_busyness($locations, false));
    }
    
    function busy_post(){
        $options = $this->post();
        $locations = array();
        if(isset($options['locations'])) {
            $locations = json_decode($options['locations']);
        }
        else if(isset($options['location'])) {
            $locations[] = $options['location'];
        }
        else {
            $this->response('No location(s) provided', 400);
        }
        $this->response($this->didi_model->set_machine_busyness($locations, true));
    }

}