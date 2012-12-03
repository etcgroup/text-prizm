<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

/**
 * Didi REST API for monitoring distributed computation
 */
class Stats extends API_Controller {

    /**
     * Create a new Didi API controller.
     */
    function __construct() {
        parent::__construct();
        //$this->load->model('didi/stats_comp_model');
    }
    
    function test_get() {
        $this->response("everything is a-ok");
    }

}