<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Didi {

    private $model;

    private function get_model() {
        if ($this->model != null) {
            return $this->model;
        }
        $CI = & get_instance();
        $this->model = $CI->didi_model;
        return $this->model;
    }

    /**
     * see db.md documentation for details on what this does. 
     */
    public function next_task() {
        //1. Fetch the next task in each task-list:
        $possible_tasks = $this->get_model()->next_tasks();
        // 2. For each (task list, progress), can identify the task_id. Then,
        // fetch the number of failures on this task thus far:
        $task_id = NULL;
        foreach ($possible_tasks as $next_task) {
            $task_id_list = json_decode($next_task->task_id_list);
            $progress = $next_task->progress;
            $task_id = $task_id_list[$progress];
            $current = $this->get_model()->count_current_work();
            if($current>0){
                continue;
            }
            $failures = $this->get_model()->count_failures($task_id);
            $prob_skip = $failures($failures + $this->safety_bias);
            if (mt_rand() < $prob_skip) {
                continue;
            }
        }
        return $this->get_model()->get_task($task_id);
    }

}

?>
