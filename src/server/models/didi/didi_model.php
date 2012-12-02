<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Didi_model extends Base_model {
    
    function __construct() {
        parent::__construct();
    }
    
    function set_machine_busyness($locations, $is_busy){
        $out = array();
        foreach ($locations as $location){
            $this->db->where('location', $location);
            $this->db->update('didi_machines', array('is_busy' => $is_busy?1:0));
            $this->db->where('location', $location);
            if($this->db->count_all_results('didi_machines')>0){
                $out[] = $location;
            }
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
    function count_failures(){
      //  return $task_id;
    }
    
    

}
