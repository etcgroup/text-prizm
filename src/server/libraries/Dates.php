<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Utility functions related to date handling.
 */
class Dates {

    /**
     * The UTC Time Zone.
     *
     * @var DateTimeZone
     */
    private $_utc_timezone;

    /**
     * Construct the Dates library.
     */
    public function __construct()
    {
        $this->_utc_timezone = new DateTimeZone('UTC');
    }

    /**
     * Get the current DateTime in UTC.
     *
     * @return DateTime
     */
    public function utc_date()
    {
        return new DateTime(NULL, $this->_utc_timezone);
    }

    /**
     * Format a PHP DateTime for MySQL datetime fields.
     *
     * @param DateTime $php_datetime A PHP DateTime object.
     *
     * @return string The PHP DateTime formatted as a MySQL datetime.
     */
    public function mysql_datetime($php_datetime)
    {
        return $php_datetime->format('Y-m-d H:i:s');
    }

    /**
     * Creates a UTC PHP DateTime from the MySQL datetime value.
     *
     * @param string $mysql_datetime
     *
     * @return DateTime
     */
    public function php_datetime($mysql_datetime)
    {
        return new DateTime($mysql_datetime, $this->_utc_timezone);
    }

    /**
     * Calculate a UTC DateTime a number of days ago.
     *
     * @param int $days The number of days ago.
     *
     * @return DateTime The resulting date.
     */
    public function days_ago($days)
    {
        $date = $this->utc_date();
        $date->modify('-' . $days . ' day');
        return $date;
    }

}