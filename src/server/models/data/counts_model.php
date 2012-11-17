<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

/**
 * Model for getting basic counts about the dataset.
 */
class Counts_model extends Base_model2 {

    /**
     * The name of the messages table.
     * @var string
     */
    private $_messages_table_name = 'data_points';

    /**
     * The name of the participants table.
     * @var string
     */
    private $_participants_table_name = 'data_participants';

    /**
     * The name of the codes table.
     * @var string
     */
    private $_codes_table_name = 'coding_codes';

    /**
     * The name of the instances table.
     * @var string
     */
    private $_instances_table_name = 'coding_instances';

    /**
     * Construct a new Counts model
     */
    function __construct()
    {
        parent::__construct();
        $this->load->library('options');
        $this->load->library('dates');
    }

    /**
     * Get the number of messages in the dataset
     *
     * @return int
     */
    function get_message_count()
    {
        return $this->db->count_all($this->_messages_table_name);
    }

    /**
     * Get the number of participants in the dataset
     *
     * @return int
     */
    function get_participant_count()
    {
        return $this->db->count_all($this->_participants_table_name);
    }

    /**
     * Get the number of codes in the dataset
     *
     * @return int
     */
    function get_code_count()
    {
        return $this->db->count_all($this->_codes_table_name);
    }

    /**
     * Get the number of coded messages.
     *
     * Valid options:
     * * 'days': the number of days over which to count coded messages (default 0)
     *
     * @param array $options Optional parameters.
     *
     * @return int
     */
    function get_coded_message_count($options)
    {
        $options = $this->options->defaults($options, array('days' => 0));

        $this->_limit_days($options['days']);

        $this->db->from($this->_instances_table_name);
        $this->db->select('COUNT(DISTINCT message_id) as count');

        return $this->db->get()->row()->count;
    }

    /**
     * Get the percent coded messages, out of the total number of messages.
     *
     * Valid options:
     * * 'days': the number of days over which to count coded messages (default 0)
     *
     * @param array $options Optional parameters.
     *
     * @return int
     */
    function get_percent_coded_messages($options)
    {
        $total_messages = $this->get_message_count();
        $coded_messages = $this->get_coded_message_count($options);
        return round(100 * $coded_messages / $total_messages);
    }

    /**
     * Get the number of instantiated codes.
     *
     * Valid options:
     * * 'days': the number of days over which to check for instances (default 0)
     *
     * @param array $options Optional parameters.
     *
     * @return int
     */
    function get_instantiated_code_count($options)
    {
        $options = $this->options->defaults($options, array('days' => 0));

        $this->_limit_days($options['days']);

        $this->db->from($this->_instances_table_name);
        $this->db->select('COUNT(DISTINCT code_id) as count');

        return $this->db->get()->row()->count;
    }

    /**
     * Get the number of active coders.
     *
     * Valid options:
     * * 'days': the number of days over which to count code instances (default 0)
     *
     * @param array $options Optional parameters.
     *
     * @return int
     */
    function get_coder_count($options)
    {
        $options = $this->options->defaults($options, array('days' => 0));

        $this->_limit_days($options['days']);

        $this->db->from($this->_instances_table_name);
        $this->db->select('COUNT(DISTINCT user_id) as count');

        return $this->db->get()->row()->count;
    }

    /**
     * Limit the query results to consider instances within the past N days.
     *
     * If $days is 0, there is no limit applied.
     *
     * @param int $days A number of days >= 0
     */
    private function _limit_days($days)
    {
        if ($days > 0)
        {
            $days_ago = $this->_get_days_ago($days);
            $this->db->where('added >', $this->dates->mysql_datetime($days_ago));
        }
    }

    /**
     * Calculate a date a number of days ago.
     *
     * @param int $days The number of days ago.
     *
     * @return DateTime The resulting date.
     */
    private function _get_days_ago($days)
    {
        $date = $this->dates->utc_date();
        $date->modify('-' . $days . ' day');
        return $date;
    }

}
