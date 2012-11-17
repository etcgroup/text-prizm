<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Utility functions related to date handling.
 */
class Dates {

    /**
     * The UTC Time Zone
     * @var DateTimeZone
     */
    private $_utc_timezone;

    public function __construct()
    {
        $this->_utc_timezone = new DateTimeZone('UTC');
    }

    /**
     * Get the current DateTime in UTC.
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

}