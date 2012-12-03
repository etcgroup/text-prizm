<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Didi_model extends Base_model {

    function __construct() {
        parent::__construct();
    }

    function set_machine_busyness($locations, $is_busy) {
        $out = array();
        foreach ($locations as $location) {
            $this->db->where('location', $location);
            $this->db->update('didi_machines', array('is_busy' => $is_busy ? 1 : 0));
            $this->db->where('location', $location);
            if ($this->db->count_all_results('didi_machines') > 0) {
                $out[] = $location;
            }
        }
        return $out;
    }

    function get_machines($limit) {
        $this->db->select('*');
        $this->db->limit($limit);
        $this->db->order_by('last_ping', 'desc');
        $query = $this->db->get('didi_machines');
        $out = array();
        foreach ($query->result() as $row) {
            $row->abilities = $this->get_machine_abilities($row->id);
            $out[] = $row;
        }
        return $out;
    }
    function refresh_machine($id, $location = null) {
        if ($id == null) {
            $this->db->where('location', $location);
        } else {
            $this->db->where('id', $id);
        }
        $this->db->update('didi_machines', array(
            'last_ping' => $this->dates->mysql_datetime($this->dates->utc_date())
        ));
    }

    function create_machine($location, $name, $types) {
        $this->db->where('location', $location);
        $exists = $this->db->count_all_results('didi_machines');
        if ($exists > 0) {
            return null;
        }

        // write the machine
        $this->db->insert('didi_machines', array(
            'location' => $location,
            'name' => $name,
            'is_busy' => FALSE,
            'last_ping' => $this->dates->mysql_datetime($this->dates->utc_date())
        ));
        $id = $this->db->insert_id();
        // write the abilities
        $types = array_unique($types);
        foreach ($types as $type) {
            $this->db->insert('didi_abilities', array(
                'machine_id' => $id,
                'task_type' => $type
            ));
        }
        return $this->get_machine_by_id($id);
    }

    function get_machine_by_location($location) {
        $this->db->select('*');
        $this->db->where('location', $location);
        $this->db->limit(1);
        $query = $this->db->get('didi_machines');
        $out = null;
        foreach ($query->result() as $row) {
            $out = $row;
            break;
        }
        $out->abilities = $this->get_machine_abilities($id);
        return $out;
    }

    function get_machine_by_id($id) {
        $this->db->select('*');
        $this->db->where('id', $id);
        $query = $this->db->get('didi_machines');
        $out = null;
        foreach ($query->result() as $row) {
            $out = $row;
            break;
        }
        $out->abilities = $this->get_machine_abilities($id);
        return $out;
    }

    function get_machine_abilities($id) {
        $out = array();
        $this->db->select('task_type');
        $this->db->where('machine_id', $id);
        $this->db->order_by('task_type');
        $query = $this->db->get('didi_abilities');
        foreach ($query->result() as $row) {
            $out[] = $row->task_type;
        }
        return $out;
    }

    function next_tasks($n = 0) {
        // 1. Fetch the next task in each task-list:
        /*
          SELECT task_list.task_id_list, progress
          FROM didi_task_list task_list
          WHERE task_list.progress < task_list.task_count
          AND current_status_id = NULL
          ORDER BY added ASC
         */
        $this->db->select('task_id_list, progress');
        $this->db->order_by('added');
        $this->db->where('progress', '< task_count');
        $this->db->where('current', NULL);
        $this->db->order_by('time', 'desc');
        if ($n > 0) {
            $this->db->limit($n);
        }
        return $this->db->get('didi_task_list')->result();
    }

    function count_failures() {
        //  return $task_id;
    }

}
