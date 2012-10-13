<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Points_model extends Base_model {

    var $table = 'data_points';

    function __construct()
    {
        parent::__construct();
    }

    /**
     * Gets the data points for a specific session.
     * @param int $session_id
     * @return array
     */
    function get_for_session($session_id, $type = null)
    {
        return $this->get_all(array('session_id' => $session_id));
    }

    /**
     * Gets all of the data poitns for the given participant
     * @param type $participant_id
     * @return type
     */
    function get_for_participant($participant_id, $session_id = null, $type = null)
    {
        return $this->get_all(array('participant_id' => $participant_id));
    }

    /**
     * Get all data points on or after $start and before $end
     * @param type $start
     * @param type $end
     * @return type
     */
    function get_in_interval($start, $end, $session_id = null, $type = null)
    {
        $this->db->where('time >=', $start);
        $this->db->where('time <', $end);
        $query = $this->db->get($this->table);
        return $query->result();
    }

    /**
     * Get all of the data points by index in session
     * @param int $session_id
     * @param int $index
     * @return object
     */
    function get_by_index($session_id, $index)
    {
        $query = $this->db->get($this->table, array(
            'session_id' => $session_id,
            'idx_in_session' => $index
                ));
        return $query->row();
    }

}
