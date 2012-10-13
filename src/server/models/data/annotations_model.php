<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Annotations_model extends Base_model {

    var $table = 'data_annotations';

    function __construct()
    {
        parent::__construct();
    }

    /**
     * Creates a new annotation.
     * @param type $start_message_id
     * @param type $end_message_id
     * @param type $memo
     * @param type $user_id
     * @param type $parent_id
     * @return type
     */
    function insert($start_message_id, $end_message_id, $memo, $user_id, $parent_id = 0)
    {
        $data = array(
            'user_id' => $user_id,
            'memo' => $memo,
            'start_message_id' => $start_message_id,
            'end_message_id' => $end_message_id,
            'added' => $this->db_now(),
            'parent_id' => $parent_id
        );
        return $this->insert_data($data);
    }

    /**
     * Get the thread that contains the given message id
     * @param type $parent_id
     * @return type
     */
    function get_thread($message_id)
    {
        $seed = $this->get($message_id);

        //Assuming all the annotations in this thread have the same start/end ids
        $this->db->where('start_message_id', $seed->start_message_id);
        $this->db->where('end_message_id', $seed->end_message_id);
        $this->db->order_by('parent_id', 'asc');

        $query = $this->db->get($this->table);
        $tmp_annot = $query->result();

        //Index the annotations and find the thread tail
        $annotations = array();
        $tail_id = $seed->id; //a default guess, but this wil change
        foreach ($tmp_annot as $ann)
        {
            $annotations[$ann->id] = $ann;
            if ($ann->parent_id == $tail_id)
            {
                $tail_id = $ann->id;
            }
        } //This should work because the items are in order by parent id, ascending
        //Now get the thread in order
        $thread = array();

        //we'll iterate head from tail to the top of the thread
        $head = $annotations[$tail_id];

        while ($head != null)
        {
            array_push($thread, $head);

            if (key_exists($head->parent_id, $annotations))
            {
                $head = $annotations[$head->parent_id];
            }
            else
            {
                break;
            }
        }

        //Flip it around, since we build it backwards
        $thread = array_reverse($thread);

        return $thread;
    }

}
