<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

/**
 * Extended API for app status.
 */
class App_status extends API_Controller {

    /**
     * Create a new App Status API controller.
     */
    function __construct()
    {
        parent::__construct();
        $this->load->model('app/status_model');
    }

    /**
     * Get a summary of app status.
     *
     * @return NULL
     */
    function summary_get()
    {
        $response = array(
            'app_name' => $this->status_model->get_name(),
            'build_version' => $this->status_model->get_version(),
            'repo_url' => $this->status_model->get_repo_url(),
            'build_time' => $this->status_model->get_build_time(),
            'build_revision' => $this->status_model->get_revision(),
            'upgrade_time' => $this->status_model->get_upgrade_time(),
            'database_host' => $this->status_model->get_database_host(),
            'database_schema' => $this->status_model->get_database_schema(),
            'database_migration' => $this->status_model->get_database_migration()
        );

        $this->response($response);
    }

}
