<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

/**
 * REST API for paged message collections.
 */
class Messages extends API_Controller {

    /**
     * Create a new Messages API controller.
     */
    function __construct()
    {
        parent::__construct();
        $this->load->library('options');
        $this->load->model('data/messages_model');
    }

    /**
     * Counts the total number of matching messages.
     *
     * @return NULL
     */
    function count_get()
    {
        $options = $this->get();

        if (!$this->options->has_keys($options, array('cluster_id')) &&
                !$this->options->has_keys($options, array('start')) &&
                !$this->options->has_keys($options, array('end')))
        {
            $this->response('Param cluster_id, start, or end is required', 400);
        }

        $count = $this->messages_model->count_messages($options);

        $this->response($count, 200);
    }

    /**
     * Get a page of messages by cluster or time.
     *
     * @return NULL
     */
    function page_get()
    {
        $options = $this->get();

        if (!$this->options->has_keys($options, array('cluster_id')) &&
                !$this->options->has_keys($options, array('start')))
        {
            $this->response('No cluster_id or start is required', 400);
        }

        $messages = $this->messages_model->get_messages($options);

        if (is_array($messages))
        {
            $this->response($messages, 200);
        }
        else
        {
            $this->response('Error getting messages', 404);
        }
    }
}
