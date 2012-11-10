<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

/**
 * Model for accessing information about
 * the status of the application.
 */
class App_status_model extends CI_Model {

    /**
     * Construct a new App Status model
     */
    function __construct()
    {
        parent::__construct();

        //Load the config where most of the data is actually stored
        $this->config->load('app');
    }

    /**
     * Get the name of the application.
     *
     * @return string
     */
    function get_name()
    {
        return $this->config->item('name');
    }

    /**
     * Get the current application version.
     *
     * @return string
     */
    function get_version()
    {
        return $this->config->item('version');
    }

    /**
     * Get the time the applicaiton was built, as a timestamp.
     *
     * @return string
     */
    function get_build_time()
    {
        //Build time is stored as "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        $build_time = $this->config->item('build_time');

        //Convert to unix timestamp
        $date = new DateTime($build_time);
        return $date->getTimestamp();
    }

    /**
     * Get the revision hash of the current build.
     *
     * @return string
     */
    function get_revision()
    {
        return $this->config->item('revision');
    }

    /**
     * Get the time the application was last upgraded, as a timestamp.
     *
     * @return string
     */
    function get_upgrade_time()
    {
        return $this->config->item('upgrade_time');
    }

    /**
     * Get the hostname of the database server.
     *
     * @return string
     */
    function get_database_host()
    {
        return $this->config->item('database_hostname');
    }

    /**
     * Get the database schema currently being used.
     *
     * @return string
     */
    function get_database_schema()
    {
        return $this->config->item('database_schema');
    }

    /**
     * Get the current database migration number.
     *
     * @return integer
     */
    function get_database_migration()
    {
        return $this->db->get('migrations')->row()->version;
    }

}
