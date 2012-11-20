<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

/**
 * Cron controller for detecting code application activities.
 */
class Apply_codes_activities extends CI_Controller {

    /**
     * The minimum gap between coding activities, in seconds (1200=20 minutes).
     *
     * @var integer
     */
    private $_gap_threshold = 1200;

    /**
     * Construct a new Activities cron job controller.
     */
    public function __construct()
    {
        parent::__construct();

        $this->input->is_cli_request()
                or exit('Execute via command line: php index.php cron/apply_codes_activities');

        $this->load->model('app/activities_model');
        $this->load->model('coding/instances_model');
        $this->load->library('dates');
    }

    /**
     * Checks for recent code application streaks and inserts activites
     * into the database for them.
     *
     * @return NULL
     */
    public function index()
    {
        $instance_filter = array(
            'order_by' => 'user_id, added asc',
        );

        $last_coding_timestamp = $this->activities_model->get_last_activity_time('apply-codes');
        if (NULL !== $last_coding_timestamp)
        {
            $last_coding_time = $this->dates->mysql_datetime(new DateTime('@' . $last_coding_timestamp));
            $instance_filter['added >'] = $last_coding_time;
        }

        //Get the recent code instances in order
        $instances = $this->instances_model->get_all($instance_filter);
        echo 'Considering ' . count($instances) . ' new code instances.' . PHP_EOL;

        $activities = $this->_scan_for_activities($instances,
                $this->_gap_threshold);
        echo 'Detected ' . count($activities) . ' coding activities.' . PHP_EOL;

        foreach ($activities as $activity)
        {
            if (NULL === $this->activities_model->log_activity($activity))
            {
                echo 'ERROR inserting activity: ' . $this->activities_model->error_message() . PHP_EOL;
                echo '----';
                var_export($activity);
                echo '----';
            }
        }
        echo 'Activity logging complete.' . PHP_EOL;
    }

    /**
     * Scans through the list of code instances finding gaps greater than the gap threshold.
     *
     * Each such gap is assumed to mark the end of a coding activity.
     *
     * @param array $instances A list of code instances. Must be sorted by 'user_id' and 'added'.
     * @param int $gap_threshold The gap in seconds after which a new activity is considered to have begun.
     *
     * @return array The list of activities.
     */
    private function _scan_for_activities($instances, $gap_threshold)
    {
        $now_timesamp = time();
        $one_gap_ago = $now_timesamp - $gap_threshold;

        $last_user = NULL;
        $last_time = NULL;
        $message_set = array();

        $activities = array();

        foreach ($instances as $instance)
        {
            $create_activity = FALSE;
            $instance_timestamp = $this->dates->php_datetime($instance->added)->getTimestamp();

            if ($instance->user_id !== $last_user)
            {
                //Is the last message for the current user old enough?
                if ($last_time !== NULL && $last_time < $one_gap_ago)
                {
                    $create_activity = TRUE;
                }
            }
            else
            {
                //Is there a gap between this instance and the last one?
                if ($instance_timestamp - $last_time > $gap_threshold)
                {
                    $create_activity = TRUE;
                }
            }

            if ($create_activity)
            {
                //Make a new activity
                $message_count = count($message_set);
                $message_set = array();
                $cluster_id = 0;
                //TODO: maybe we should store cluster id on instances? what if they aren't all in the same cluster?

                $activities[] = $this->_apply_codes_activity($last_user,
                        $last_time, $cluster_id, $message_count);
            }

            $last_user = $instance->user_id;
            $last_time = $instance_timestamp;
            $message_set[$instance->message_id] = TRUE;
        }

        //Check the lest section of instances
        if ($last_time !== NULL && $now_timesamp - $last_time > $gap_threshold)
        {
            $message_count = count($message_set);
            $message_set = array();
            $cluster_id = 0;

            $activities[] = $this->_apply_codes_activity($last_user, $last_time,
                    $cluster_id, $message_count);
        }

        return $activities;
    }

    /**
     * Creates activity data from the provided values.
     *
     * @param int $user_id The user id.
     * @param string $time The MySQL datetime.
     * @param int $cluster_id The cluster id.
     * @param int $message_count The number of messages coded.
     *
     * @return array
     */
    private function _apply_codes_activity($user_id, $time, $cluster_id, $message_count)
    {
        return array(
            'user_id' => $user_id,
            'time' => $time,
            'activity_type' => 'apply-codes',
            'ref_id' => NULL,
            'json_data' => "{ \"cluster_id\": {$cluster_id}, \"messages\": {$message_count} }"
        );
    }

}