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
     * Get an activity by id.
     *
     * @return NULL
     */
    function task_get() {
        $activity = $this->activities_model->get_activity($options['id']);

        $this->response($activity);
    }

}