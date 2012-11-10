<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

/**
 * Model for retrieving and manipulating activities data.
 */
class Activities_model extends CI_Model {

    /**
     * The current error message.
     *
     * @var string
     */
    private $_error_message;

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
     * Construct a new Activities model
     */
    function __construct()
    {
        parent::__construct();
        $this->load->library('options');
    }

    /**
     * Sets the error message and returns FALSE.
     *
     * @param string $message
     * @return boolean
     */
    private function _model_error($message)
    {
        $this->_error_message = $message;
        return FALSE;
    }

    /**
     * Get the error message.
     *
     * @return string
     */
    public function error_message()
    {
        return $this->_error_message;
    }

    /**
     * Get the most recent activities in reverse chronological order.
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

        $activities = $this->db->get('activities')->result();

        return $activities;
    }

    /**
     * Add a new activity.
     *
     * On success, returns the data for the new activity as an object.
     * On failure, returns FALSE.
     *
     * @param array $options Data about the activity.
     *
     * @return object
     */
    function add_activity($options)
    {
        //Check for the required fields
        if (!$this->options->has_keys($options,
                        array('user_id', 'time', 'activity_type')))
        {
            return $this->_model_error('Missing fields');
        }

        //Remove any unwanted fields
        $options = $this->options->filter_keys($options,
                array('user_id', 'time', 'activity_type', 'data'));

        //Make sure the activity_type is supported
        if (!$this->is_activity_type($options['activity_type']))
        {
            return $this->_model_error('Unknown activity_type');
        }

        //Finally insert into the database
        if (!$this->db->insert($this->table_name, $options))
        {
            $return_value = (object) $options;
            $return_value->id = $this->db->insert_id();
            return $return_value;
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

}
