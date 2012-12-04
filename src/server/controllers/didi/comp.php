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
        $task = $this->didi->next_task();
        if($task == null){
            $this->response('No task available', 404);
        }
        $task->parallel = strlen($task->data_json)>0?true:false;
        $this->response($task);
    }
    
    /**
     * claim a  task 
     */
    
    /**
     * update run status
     */
    function run_post() {
        $options = $this->post();
        if (!$this->options->has_keys($options, array('status_id'))) {
            $this->response('Insufficient data provided', 400);
        }
        $status_id = $options['status_id'];
        if(!isset($task)){
            $this->response('Task not found', 404);
        }
        if(isset($options['failed']) && $options['failed']==true){
            $this->didi_model->fail_task($task->id);   
        } else if(isset($options['progress'])){
            $this->didi_model->update_task($task_id, $options['progress']);
        }
        $status = $this->didi_model->get_status($status_id);
        $this->response();
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
            // old behavior was to 401. This is annoying. New behavior is to update
            // last_ping and abilities
            $machine = $this->didi_model->get_machine_by_location($options['location']);
            $this->didi_model->refresh_machine($machine->id);
            $this->didi_model->refresh_machine_abilities($machine->id, json_decode($options['types']));
            $machine->abilities = $this->didi_model->get_machine_abilities($machine->id);
        }
        $this->response($machine);
    }
    
    function machine_delete() {
        $options = $this->delete();
        if(!isset($options['location'])){
            $this->response('Insufficient parameters', 400);
        }
        $this->didi_model->delete_machine($options['location']);
        $this->response('OK');
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