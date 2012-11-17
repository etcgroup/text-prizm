<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Base_model2 extends CI_Model {

    /**
     * The current error message.
     *
     * @var string
     */
    private $_error_message;

    function __construct()
    {
        parent::__construct();
    }

    /**
     * Sets the error message and returns FALSE.
     *
     * @param string $message
     * @return boolean
     */
    protected function _model_error($message)
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