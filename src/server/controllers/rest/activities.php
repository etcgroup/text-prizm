<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

/**
 * REST API for working with activities.
 */
class Activities extends API_Controller {

    /**
     * Create a new Activities API controller.
     */
    function __construct()
    {
        parent::__construct();
        $this->load->library('options');
        $this->load->model('app/activities');
    }

    /**
     * Get an activity by id.
     *
     * @return NULL
     */
    function activity_get()
    {
        $options = $this->get();

        if (!$this->options->has_keys($options, array('id')))
        {
            $this->response('No id provided', 400);
        }

        $activity = $this->activities->get_activity($options['id']);

        $this->response($activity);
    }

    /**
     * Get a list of recent activities.
     *
     * @return NULL
     */
    function recent_get()
    {
        $options = $this->get();

        $recent_activities = $this->activites->get_recent_activites($options);

        //As long as it is an array, we return success. Even if empty.
        if (is_array($recent_activities))
        {
            $this->response($recent_activities, 200);
        }
        else
        {
            $this->response('Error getting activities', 404);
        }
    }

    /**
     * Create a new activity.
     *
     * @return NULL
     */
    function activity_put()
    {
        $options = $this->put();

        $activity_id = $this->activities->log_activity($options);
        if (FALSE === $activity_id)
        {
            $this->response($this->activities->error_message(), 400);
        }

        $activity = $this->activities->get_activity($activity_id);

        $this->response($activity);
    }

}
