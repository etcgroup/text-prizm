<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

/**
 * Extended API for code analysis
 */
class Code_analysis extends API_Controller {

    /**
     * Create a new Code Analysis API controller.
     */
    function __construct()
    {
        parent::__construct();
        $this->load->model('coding/codes_model');
    }

    /**
     * For a pair of code ids, this retrieves metrics for reasoning about
     * that pair.
     *
     * @return NULL
     */
    function pair_metrics_get()
    {
        $options = $this->get();
        $this->response($this->codes_model->pair_metrics($options));
    }

}
