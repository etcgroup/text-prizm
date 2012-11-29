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
        $this->load->model('didi/didi_comp_model');
    }

    /**
     * Returns a task to work on, as a JSON object. No parameters
     *
     * @return NULL
     */
    function task_get() {
        $this->response($this->didi->next_task());
    }

}