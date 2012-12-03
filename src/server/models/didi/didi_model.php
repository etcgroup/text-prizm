<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Didi_model extends Base_model {

    function __construct() {
        parent::__construct();
        $this->load->library('dates');
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

    function get_jobs($limit) {
        $this->db->select('*');
        $this->db->limit($limit);
        $this->db->order_by('paused');
        $this->db->order_by('added', 'desc');
        $query = $this->db->get('didi_jobs');
        $out = array();
        foreach ($query->result() as $row) {
            $out[] = $this->prepare_job($row);
        }
        return $out;
    }

    function get_job($id) {
        $this->db->select('*');
        $this->db->where('id', $id);
        ;
        $query = $this->db->get('didi_jobs');
        $out = array();
        foreach ($query->result() as $row) {
            return $this->prepare_job($row);
        }
    }

    private function prepare_job($job) {
        $job->added = $this->dates->php_datetime($job->added)->getTimestamp();
        $job->task_list = $this->get_tasks(json_decode($job->task_id_list));
        $job->user = new stdClass();
        $job->user->id = $job->user_id;
        $job->user->name = 'test';
        $job->user->full_name = 'didi tester';
        $job->user->email = 'em@i.l';
        return $job;
    }

    function get_tasks($ids) {
        $out = array();
        foreach ($ids as $id) {
            $task = $this->get_task($id);
            if (isset($task)) {
                $out[] = $task;
            }
        }
        return $out;
    }

    function get_task($id) {
        $this->db->select('*');
        $this->db->where('id', $id);
        $query = $this->db->get('didi_tasks');
        foreach ($query->result() as $row) {
            return $row;
        }
        return null;
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

    function create_job($description, $task_id_list) {
        $job = new stdClass();
        $job->description = $description;
        $job->task_id_list = json_encode($task_id_list);
        $job->count = count($task_id_list);
        $job->progress = 0;
        $job->user_id = -1;
        $job->paused = 0;
        $job->added = $this->dates->mysql_datetime($this->dates->utc_date());
        $this->db->insert('didi_jobs', $job);
        return $this->db->insert_id();
    }

    function create_task($object) {
        $object['hash'] = sha1(json_encode($object));
        $object['finished'] = 0;
        $object['invalid'] = 0;
        $this->db->insert('didi_tasks', $object);
        return $this->db->insert_id();
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
        $this->db->order_by('added', 'desc');
        if ($n > 0) {
            $this->db->limit($n);
        }
        return $this->db->get('didi_jobs')->result();
    }

    // how many isntances of this task are being worked on>
    function count_current_work($task_id) {
        $this->db->where('task_id', $task_id);
        $this->db->where('has_failed', false);
        $this->db->where('progress', '< 100');
        return $this->db->get('didi_status')->count_all_results();
    }

    function count_failures($task_id) {
        // SELECT COUNT(*) failures fROM didi_status WHERE task_id=[task_id] and has_failed=TRUE
        $this->db->where('task_id', $task_id);
        $this->db->where('has_failed', true);
        return $this->db->get('didi_status')->count_all_results();
        //  return $task_id;
    }

}
