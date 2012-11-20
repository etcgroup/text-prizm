<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

/**
 * Base Model class providing utilities such as error tracking.
 */
class Base_model2 extends CI_Model {

    /**
     * The current error message.
     *
     * @var string
     */
    private $_error_message;

    /**
     * Construct a new base model.
     */
    function __construct()
    {
        parent::__construct();
    }

    /**
     * Sets the error message and returns FALSE.
     *
     * @param string $message The error message.
     * @return boolean
     */
    protected function model_error($message)
    {
        $this->_error_message = $message;
        return FALSE;
    }

    /**
     * Get the error message.
     *
     * @return string
     */
    public function error_message()
    {
        return $this->_error_message;
    }

}