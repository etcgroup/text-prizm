<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

/**
 * Extended api for getting basic data set statistics.
 */
class Data_counts extends API_Controller {

    /**
     * Create a new Data_counts API controller.
     */
    function __construct()
    {
        parent::__construct();
        $this->load->library('options');
        $this->load->model('data/counts_model');
    }

    /**
     * Get an exhaustive map of all available counts.
     *
     * @return NULL
     */
    function summary_get()
    {
        $options = $this->options->defaults($this->get(), array('days' => 0));

        $summary = array(
            'messages' => $this->counts_model->get_message_count(),
            'participants' => $this->counts_model->get_participant_count(),
            'codes' => $this->counts_model->get_code_count(),
            'coded_messages' => $this->counts_model->get_coded_message_count($options),
            'instantiated_codes' => $this->counts_model->get_instantiated_code_count($options),
            'coders' => $this->counts_model->get_coder_count($options)
        );

        $this->response($summary);
    }

    /**
     * Get the number of messages in the dataset.
     *
     * @return NULL
     */
    function messages_get()
    {
        $this->response($this->counts_model->get_message_count());
    }

    /**
     * Get the number of participants.
     *
     * @return NULL
     */
    function participants_get()
    {
        $this->response($this->counts_model->get_participant_count());
    }

    /**
     * Get the number of codes.
     *
     * @return NULL
     */
    function codes_get()
    {
        $this->response($this->counts_model->get_code_count());
    }

    /**
     * Get the number of coded messages.
     *
     * @return NULL
     */
    function coded_messages_get()
    {
        $options = $this->get();

        $this->response($this->counts_model->get_coded_message_count($options));
    }

    /**
     * Get the percent coded messages, out of the total number of messages.
     *
     * @return NULL
     */
    function percent_coded_messages_get()
    {
        $options = $this->get();

        $this->response($this->counts_model->percent_coded_messages($options));
    }

    /**
     * Get the number of instantiated codes.
     *
     * @return NULL
     */
    function instantiated_codes_get()
    {
        $options = $this->get();

        $this->response($this->counts_model->get_instantiated_code_count($options));
    }

    /**
     * Get the number of active coders.
     *
     * Actively coding refers to any user of TextPrizm having applied one or more code
     * instance in the specified day range.
     *
     * @return NULL
     */
    function coders_get()
    {
        $options = $this->get();

        $this->response($this->counts_model->get_coder_count($options));
    }

}
