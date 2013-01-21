<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

/**
 * Model for retrieving messages.
 */
class Messages_model extends Base_model2 {

    /**
     * The name of the messages table.
     *
     * @var string
     */
    private $_table_name = 'data_points';

    /**
     * Construct a new Messages model
     */
    function __construct()
    {
        parent::__construct();
        $this->load->library('options');
        $this->load->library('dates');
        $this->load->model('data/participants_model');
        $this->load->model('coding/instances_model');
    }

    /**
     * Get the count of matching messages.
     *
     * Valid options:
     * * 'cluster_id': return messages from the given cluster (default NULL)
     * * 'start': messages after this MySQL datetime will be returned (default NULL)
     *
     * @param array $options An optional set of parameters.
     *
     * @return int The number of messages available.
     */
    function count_messages($options = array())
    {
        $options = $this->options->defaults($options,
                array(
            'cluster_id' => NULL,
            'start' => NULL));

        //Apply the cluster filter if set
        if (NULL !== $options['cluster_id'])
        {
            $this->db->where('session_id', $options['cluster_id']);
        }

        if (NULL !== $options['start'])
        {
            $this->db->where('time >=', $options['start']);
        }

        $count = $this->db->count_all_results($this->_table_name);

        return $count;
    }

    /**
     * Get messages in chronological order, subject to constraints.
     *
     * Valid options:
     * * 'limit': the maximum number of messages to return (default 100)
     * * 'offset': the result offset (default 0)
     * * 'cluster_id': return messages from the given cluster (default NULL)
     * * 'start': messages after this MySQL datetime will be returned (default NULL)
     *
     * @param array $options An optional set of parameters.
     *
     * @return array The requested activites, or an empty array if none.
     */
    function get_messages($options = array())
    {
        $options = $this->options->defaults($options,
                array(
            'limit' => 100,
            'offset' => 0,
            'cluster_id' => NULL,
            'start' => NULL));

        $this->db->limit($options['limit'], $options['offset']);
        $this->db->order_by('time', 'asc');

        //Apply the cluster filter if set
        if (NULL !== $options['cluster_id'])
        {
            $this->db->where('session_id', $options['cluster_id']);
        }

        if (NULL !== $options['start'])
        {
            $this->db->where('time >=', $options['start']);
        }

        $messages = $this->db->get($this->_table_name)->result();

        //Insert sub-model data
        foreach ($messages as &$message)
        {
            $this->_fill_in($message);
        }

        return $messages;
    }

    /**
     * Fills in the missing message data (participant, time, etc.)
     * The object is modified in place.
     *
     * @param object $message A message data object straight from the database.
     *
     * @return NULL
     */
    private function _fill_in($message)
    {
        $message->time = $this->dates->php_datetime($message->time)->getTimestamp();
        $message->participant = $this->participants_model->get($message->participant_id);
        $message->instances = $this->instances_model->get_all_for_message($message->id);
        unset($message->participant_id);
    }
}
