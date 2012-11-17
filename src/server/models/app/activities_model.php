<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

/**
 * Model for retrieving and manipulating activities data.
 */
class Activities_model extends Base_model2 {

    /**
     * The recognized activity types.
     *
     * @var array
     */
    private $_activity_types = array(
        'apply-codes',
        'create-code',
        'update-code',
        'create-memo',
        'update-memo',
    );

    /**
     * The name of the activities table.
     * @var string
     */
    private $_table_name = 'activities';

    /**
     * Construct a new Activities model
     */
    function __construct()
    {
        parent::__construct();
        $this->load->library('options');
    }

    /**
     * Get a single activity by id.
     *
     * @param integer $id
     */
    function get_activity($id)
    {
        $this->db->where('id', $id);
        return $this->db->get($this->_table_name)->row();
    }

    /**
     * Get the most recent activities in reverse chronological order.
     *
     * Only activities with a recognized activity type are returned.
     *
     * Valid options:
     * * 'limit': the maximum number of activities to return (default 10)
     * * 'offset': the result offset (default 0)
     *
     * @param array $options An optional set of parameters
     */
    function get_recent_activities($options = array())
    {
        $options = $this->options->defaults($options,
                array('limit' => 10, 'offset' => 0));

        $this->db->limit($options['limit'], $options['offset']);
        $this->db->order_by('time', 'desc');

        $activities = $this->db->get($this->_table_name)->result();

        //Remove the unreognized activities
        $activities = $this->_recognized($activities);

        return $activities;
    }

    /**
     * Log a new activity.
     *
     * On success, returns the id of the inserted activity.
     * On failure, returns FALSE.
     *
     * $options can include user_id, time, activity_type, and json_data.
     *
     * @param array $options Data about the activity.
     *
     * @return mixed
     */
    function log_activity($options)
    {
        //Check for the required fields
        if (!$this->options->has_keys($options,
                        array('user_id', 'time', 'activity_type')))
        {
            return $this->_model_error('Missing fields');
        }

        //Remove any unwanted fields
        $options = $this->options->filter_keys($options,
                array('user_id', 'time', 'activity_type', 'json_data'));

        //Make sure the activity_type is supported
        if (!$this->is_activity_type($options['activity_type']))
        {
            return $this->_model_error('Unknown activity_type');
        }

        //Finally insert into the database
        if (!$this->db->insert($this->_table_name, $options))
        {
            return $this->db->insert_id();
        }
        else
        {
            return $this->_model_error('Error inserting activity');
        }
    }

    /**
     * Get a list of supported activity types.
     *
     * @return array
     */
    function get_activity_types()
    {
        return $this->_activity_types;
    }

    /**
     * Returns TRUE if the provided type is a recognized activity type.
     *
     * @param string $activity_type The proposed activity type.
     *
     * @return boolean
     */
    function is_activity_type($activity_type)
    {
        return in_array($activity_type, $this->_activity_types);
    }

    /**
     * Returns a new array containing only the activities
     * with a recognized activity type.
     *
     * @param array $activities The array of activity objects to filter.
     *
     * @return array
     */
    private function _recognized($activities)
    {
        $recognized = array();

        foreach ($activities as $activity)
        {
            if ($this->is_activity_type($activity->activity_type))
            {
                $recognized[] = $activity;
            }
        }

        return $recognized;
    }

}
