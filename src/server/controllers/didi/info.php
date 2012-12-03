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
        //$this->load->model('didi/stats_comp_model');
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

}