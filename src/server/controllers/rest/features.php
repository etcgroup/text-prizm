<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Features extends API_Controller {

    /**
     * Create a new Activities API controller.
     */
    function __construct() {
        parent::__construct();
        $this->load->library('options');
        $this->load->model('auto/ml_model');
    }

    /**
     * Requires 
     */
    function extraction_put() {
        $options = $this->put();
        if (!$this->options->has_keys($options, array('didi_task_id', 'message_id', 'result_map'))) {
            $this->response('Insufficient data provided', 400);
        }
        // check that didi task and datapointid exists; if not, 404
        //TODO
    }

    function extraction_delete() {
        $options = $this->delete();
        if (!isset($options['didi_task_id'])) {
            $this->response('Insufficient data provided', 400);
        }
        //does this work?
        $this->db->where('didi_task_id', $options['didi_task_id']);
        if (isset($options['message_id'])) {
            $this->db->where('message_id', $options['message_id']);
        }
        $this->response($this->db->delete('features'));
    }

}
