<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Coding extends CI_Controller {

    /**
     * Index Page for this controller.
     *
     * Maps to the following URL
     * 		http://example.com/index.php/welcome
     * 	- or -
     * 		http://example.com/index.php/welcome/index
     * 	- or -
     * Since this controller is set as the default controller in
     * config/routes.php, it's displayed at http://example.com/
     *
     * So any other public methods not prefixed with an underscore will
     * map to /index.php/welcome/<method_name>
     * @see http://codeigniter.com/user_guide/general/urls.html
     */
    public function index()
    {

        $this->load->model('coding/Codes_model');
        $this->load->model('gen/Users_model');
        $this->load->model('data/Participants_model');

        $current_user = $this->Users_model->current_user();

        if ($current_user)
        {
            //Governs all code/instances loaded by the UI
            $schema_id = $this->input->get('schema_id');
            if ($schema_id === false)
            {
                $schema_id = 2; //Default schema id
            }

            //Data that is needed regardless of which log is being worked on
            $users = $this->Users_model->get_all();
            $codes = $this->Codes_model->get_all(array('schema_id' => $schema_id));
            $participants = $this->Participants_model->get_all();

            $data = array(
                'version' => $this->config->item('version'),
                'users' => $users,
                'user_id' => $current_user->id,
                'codes' => $codes,
                'schema_id' => $schema_id,
                'participants' => $participants
            );

            if ($this->input->get('get_all_users'))
            {
                $data['get_all_users'] = true;
            }

            $this->load->view('coding', $data);
        }
    }

    public function notes()
    {
        $this->load->view('notes', array('version' => $this->config->item('version')));
    }

}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */