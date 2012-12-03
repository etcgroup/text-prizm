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
    function __construct() {
        parent::__construct();
        $this->load->model('didi/didi_model');
    }
    
    function machine_get() {
        $options = $this->get();
        $out = null;
        if (isset($options['id'])) {
            $out = $this->didi_model->get_machine_by_id($options['id']);
        } else if (isset($options['location'])) {
            $out = $this->didi_model->get_machine_by_location($options['location']);
        } else {
            $this->response('Insufficient data provided', 400);
        }
        if($out==null){
            $this->response('Machine not found', 404);
        }
        $this->response($out);
    }

    function machines_get() {
        $options = $this->get();
        $limit = 10;
        if (isset($options['limit'])) {
            $limit = $options['limit'];
        }
        $this->response($this->didi_model->get_machines($limit));
    }

}