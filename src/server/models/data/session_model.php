<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Session_model extends Base_model {

    var $table = 'data_sessions';

    function __construct()
    {
        parent::__construct();
    }

    /**
     * Gets the data sessions for a specific data set.
     * @param int $set_id
     * @return array
     */
    function get_for_set($set_id)
    {
        return $this->get_all(array('dataset_id' => $set_id));
    }

    /**
     * Get all sessions in the data set on or after the start and before the end time.
     * @param type $set_id
     * @param type $start
     * @param type $end
     * @return type
     */
    function get_in_interval($set_id, $start, $end)
    {
        $this->db->where('time >=', $start);
        $this->db->where('time <', $end);
        $query = $this->db->get($this->table);
        return $query->result();
    }

}
