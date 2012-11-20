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
     *
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
        $this->load->library('dates');
        $this->load->model('gen/users_model');
        $this->load->model('coding/codes_model');
    }

    /**
     * Get a single activity by id.
     *
     * @param integer $id The id of the activity.
     *
     * @return object The requested activity, or NULL if not found.
     */
    function get_activity($id)
    {
        $this->db->where('id', $id);
        $activity = $this->db->get($this->_table_name)->row();

        $this->_fill_in($activity);

        return $activity;
    }

    /**
     * Get the most recent activities in reverse chronological order.
     *
     * Only activities with a recognized activity type are returned.
     *
     * Valid options:
     * * 'limit': the maximum number of activities to return (default 10)
     * * 'offset': the result offset (default 0)
     * * 'activity_type': the desired activity type (default NULL)
     *
     * @param array $options An optional set of parameters
     *
     * @return array The requested activites, or an empty array if none.
     */
    function get_recent_activities($options = array())
    {
        $options = $this->options->defaults($options,
                array('limit' => 10, 'offset' => 0, 'activity_type' => NULL));

        $this->db->limit($options['limit'], $options['offset']);
        $this->db->order_by('time', 'desc');

        //Apply the activity type filter if set
        if (NULL !== $options['activity_type'])
        {
            $this->db->where('activity_type', $options['activity_type']);
        }

        $activities = $this->db->get($this->_table_name)->result();

        //Remove the unreognized activities
        $activities = $this->_recognized($activities);

        //Insert sub-model data
        foreach ($activities as &$activity)
        {
            $this->_fill_in($activity);
        }

        return $activities;
    }

    /**
     * Log a new activity.
     *
     * On success, returns the id of the inserted activity.
     * On failure, returns FALSE.
     *
     * $options can include user_id, time, activity_type, ref_id, and json_data.
     *
     * @param array $options Data about the activity.
     *
     * @return int The id of the inserted activity, or NULL on error.
     */
    function log_activity($options)
    {
        //Check for the required fields
        if (!$this->options->has_keys($options,
                        array('user_id', 'time', 'activity_type')))
        {
            return $this->model_error('Missing fields');
        }

        //Remove any unwanted fields
        $options = $this->options->filter_keys($options,
                array('user_id', 'time', 'activity_type', 'ref_id', 'json_data'));

        //Make sure the activity_type is supported
        if (!$this->is_activity_type($options['activity_type']))
        {
            return $this->model_error('Unknown activity_type');
        }

        //Convert the timestamp to datetime
        $date_time = new DateTime('@' . $options['time']);
        $options['time'] = $this->dates->mysql_datetime($date_time);

        //Finally insert into the database
        if ($this->db->insert($this->_table_name, $options))
        {
            return $this->db->insert_id();
        }
        else
        {
            return $this->model_error('Error inserting activity');
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
     * Gets the timestamp of the most recent activity of the given type.
     *
     * @return string The unix timestamp of the activity, or NULL if no activities.
     */
    public function get_last_activity_time($activity_type)
    {
        $recent_activities = $this->get_recent_activities(array(
            'limit' => 1,
            'activity_type' => $activity_type
                ));

        if (count($recent_activities) > 0)
        {
            return $recent_activities[0]->time;
        }

        return NULL;
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

    /**
     * Fills in the missing activity data (user, time, etc.)
     * The object is modified in place.
     *
     * @param object $activity An activity data object straight from the database.
     *
     * @return NULL
     */
    private function _fill_in($activity)
    {
        $activity->time = $this->dates->php_datetime($activity->time)->getTimestamp();
        $activity->user = $this->users_model->get($activity->user_id);

        // Now we need to get additional data depending on the activity type
        switch ($activity->activity_type)
        {
            case 'apply-codes':
                //nothing to get here
                break;
            case 'create-code':
            case 'update-code':
                $code_id = $activity->ref_id;
                $activity->ref_obj = $this->codes_model->get($code_id);
                break;
            case 'create-memo':
            case 'update-memo':
                $memo_id = $activity->ref_id;
                $activity->ref_obj = array(); //TODO: fill in once memos work
                break;
            default:
                break;
        }

        unset($activity->user_id);
    }

}
