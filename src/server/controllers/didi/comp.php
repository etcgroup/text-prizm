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

        // write the machine
        $this->db->insert('didi_machines', array(
            'location' => $options['location'],
            'name' => $options['name'],
            'is_busy' => FALSE,
            'last_ping' => $this->dates->mysql_datetime($this->dates->utc_date())
        ));

        // retrieve it
        $this->db->select('*');
        $this->db->where('location', $options['location']);
        $query = $this->db->get('didi_machines');
        $out = null;
        foreach ($query->result() as $row) {
            $out = $row;
            break;
        }

        // write the abilities
        $types = array_unique(json_decode($options['types']));
        foreach ($types as $type) {
            $this->db->insert('didi_abilities', array(
                'machine_id' => $out->id,
                'task_type' => $type
            ));
        }

        // retrieve the abilities
        $this->db->select('task_type');
        $this->db->where('machine_id', $out->id);
        $this->db->order_by('task_type');
        $query = $this->db->get('didi_abilities');
        $out->abilities = array();
        foreach ($query->result() as $row) {
            $out->abilities[] = $row->task_type;
        }
        $this->response($out);
    }

    function machine_get() {
        $options = $this->get();
        $id = null;
        if (isset($options['id'])) {
            $id = $options['id'];
        } else if (!isset($options['location'])) {
            $this->response('Insufficient data provided', 400);
        }

        $this->db->select('*');
        if ($id == null) {
            $this->db->where('location', $options['location']);
        } else {
            $this->db->where('id', $options['id']);
        }
        $query = $this->db->get('didi_machines');
        $out = null;
        foreach ($query->result() as $row) {
            $out = $row;
            break;
        }

        $this->db->select('task_type');
        $this->db->where('machine_id', $out->id);
        $this->db->order_by('task_type');
        $query = $this->db->get('didi_abilities');
        $out->abilities = array();
        foreach ($query->result() as $row) {
            $out->abilities[] = $row->task_type;
        }
        $this->response($out);
    }

    function machines_get() {
        $options = $this->get();
        $limit = 10;
        if (isset($options['limit'])) {
            $limit = $options['limit'];
        }

        $this->db->select('*');
        $this->db->limit($limit);
        $this->db->order_by('last_ping', 'desc');
        $query = $this->db->get('didi_machines');
        $out = array();
        foreach ($query->result() as $row) {
            $this->db->select('task_type');
            $this->db->where('machine_id', $row->id);
            $this->db->order_by('task_type');
            $q = $this->db->get('didi_abilities');
            $row->abilities = array();
            foreach ($q->result() as $r) {
                $row->abilities[] = $r->task_type;
            }
            $out[] = $row;
        }
        $this->response($out);
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