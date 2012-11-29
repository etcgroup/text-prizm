<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Didi_comp_model extends Base_model {

    function __construct() {
        parent::__construct();
    }

    public function get_next_tasks_in_list() {

        /*
          SELECT task_list.task_id_list, progress
          FROM didi_task_list task_list
          WHERE task_list.progress < task_list.task_count
          AND current_status_id = NULL
          ORDER BY added ASC
         */
        $this->db->select('task_list_id, progress');
        $this->db->order_by('added');
        $this->db->where('progress', '< task_count');
        $this->db->where('current', NULL);
        $this->db->order_by('time', 'desc');
        $next_tasks = $this->db->get('didi_task_list')->result();
        
        foreach($next_tasks as $next_task){
            $task_list_id = $next_task['task_list_id'];
            $progress = $next_task['progress'];
            
        }

        return $activities;
    }

}
