<?php

defined('BASEPATH') OR exit('No direct script access allowed');


class Didi {
    
    private $comp_model;
    
    private function get_comp_model(){
        if($this->comp_model!=null){
            return $this->comp_model;
        }
        $CI = & get_instance();
        $this->comp_model = $CI->didi_comp_model;
        return $this->model;
    }
    
    /**
     * see db.md documentation for details on what this does. 
     */
    public function next_task(){
        //1. Fetch the next task in each task-list:
        $possible_tasks = $this->get_comp_model()->next_tasks();
        // 2. For each (task list, progress), can identify the task_id. Then, fetch the number of failures on this task thus far:
        // SELECT COUNT(*) failures fROM didi_status WHERE task_id=[task_id] and has_failed=TRUE
        $task_id = NULL;
        foreach ($possible_tasks as $next_task) {
            $task_id_list = json_decode($next_task['task_id_list']);
            $progress = $next_task['progress'];
            $task_id = $task_id_list[$progress];
            $this->db->select('count(*)');
            $this->db->where('task_id', $task_id);
            $this->db->where('has_failed', true);
            $failures = $this->db->get('didi_status')->result();
            $prob_skip = $failures($failures + $this->safety_bias);
            if(mt_rand() < $prob_skip){
                continue;
            }
        }

    }
}

?>
