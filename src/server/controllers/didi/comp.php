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

    function machine_put() {
        $options = $this->put();
        if (!$this->options->has_keys($options, array('location', 'name', 'types'))) {
            $this->response('Insufficient data provided', 400);
        }
        $this->db->where('location', $options['location']);
        $exists = $this->db->count_all_results('didi_machines');
        if ($exists > 0) {
            $this->response('A machine already exists at this location.', 400);
        }
        $this->db->insert('didi_machines', array(
            'location' => $options['location'],
            'name' => $options['name'],
            'is_busy' => FALSE,
            'last_ping' => $this->dates->mysql_datetime($this->dates->utc_date())
                )
        );
        $this->db->select('*');
        $this->db->where('location', $options['location']);
        $query = $this->db->get('didi_machines');
        foreach ($query->result() as $row) {
            $this->response($row);
        }
    }

    function machine_post() {
        $options = $this->post();
        if (!$this->options->has_keys($options, array('location', 'name'))) {
            $this->response('No id provided', 400);
        }
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

}