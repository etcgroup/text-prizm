<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Data extends API_Controller {

    function __construct()
    {
        parent::__construct();
    }

    // SESSIONS

    function session_get()
    {
        if (!$this->get('id'))
        {
            $this->response(array('error' => 'No id provided'), 400);
        }

        $this->load->model('data/Session_model');
        $session_data = $this->Session_model->get($this->get('id'));

        if ($session_data)
        {
            $this->response($session_data, 200);
        }
        else
        {
            $this->response(array('error' => 'Session could not be found'), 404);
        }
    }

    function sessions_get()
    {
        $this->load->model('data/Session_model');

        $filter = $this->build_filter($this->get(), array(
            'set_id', 'started_from', 'ended_to'
                ));
        $data = $this->Session_model->get_all($filter);

        $this->doResponse($data);
    }

    //DATA SETS

    function set_get()
    {
        if (!$this->get('id'))
        {
            $this->response(array('error' => 'No id provided'), 400);
        }

        $this->load->model('data/Set_model');
        $data = $this->Set_model->get($this->get('id'));

        if ($data)
        {
            $this->response($data, 200);
        }
        else
        {
            $this->response(array('error' => 'Session could not be found'), 404);
        }
    }

    function sets_get()
    {
        $this->load->model('data/Set_model');
        $filter = null;
        $data = $this->Set_model->get_all($filter);

        $this->doResponse($data);
    }

    // POINTS

    function point_get()
    {
        if (!$this->get('id'))
        {
            $this->response(array('error' => 'No id provided'), 400);
        }

        $this->load->model('data/Points_model');
        $data = $this->Points_model->get($this->get('id'));

        if ($data)
        {
            $this->response($data, 200);
        }
        else
        {
            $this->response(array('error' => 'Point could not be found'), 404);
        }
    }

    function points_get()
    {
        $this->load->model('data/Points_model');

        $filter = $this->build_filter($this->get(), array(
            'session_id',
            'time_from', 'time_to',
            'idx_from', 'idx_to',
            'participant_id'));

        $data = $this->Points_model->get_all($filter);

        $this->doResponse($data);
    }

    // PARTICIPANTS

    function participant_get()
    {
        if (!$this->get('id'))
        {
            $this->response(array('error' => 'No id provided'), 400);
        }

        $this->load->model('data/Participants_model');
        $data = $this->Participants_model->get($this->get('id'));

        if ($data)
        {
            $this->response($data, 200);
        }
        else
        {
            $this->response(array('error' => 'Participant could not be found'), 404);
        }
    }

    function participants_get()
    {
        $this->load->model('data/Participants_model');

        $filter = $this->build_filter($this->get(), array('name_like'));
        $data = $this->Participants_model->get_all($filter);

        $this->doResponse($data);
    }

    // ANNOTATIONS

    /**
     * Gets the annotation given by id
     */
    function annotation_get()
    {
        if (!$this->get('id'))
        {
            $this->response(array('error' => 'No id provided'), 400);
        }

        $this->load->model('data/Annotations_model');
        $data = $this->Annotations_model->get($this->get('id'));

        if ($data)
        {
            $this->response($data, 200);
        }
        else
        {
            $this->response(array('error' => 'Participant could not be found'), 404);
        }
    }

    function annotations_get()
    {
        $this->load->model('data/Annotations_model');
        $filter = null;
        $data = $this->Annotations_model->get_all($filter);

        $this->doResponse($data);
    }

    /**
     * Inserts a new annotation.
     * Returns the annotation, if inserted.
     */
    function annotation_post()
    {
        $this->load->model('data/Annotations_model');

        $parent_id = $this->post('parent_id');

        $data = $this->Annotations_model->insert(
                $this->post('start_message_id'), $this->post('end_message_id'), $this->post('memo'), $this->post('user_id'), $parent_id);
        if ($data)
        {
            $this->response($data, 201);
        }
        else
        {
            $this->response(array('error' => 'Annotation not created'), 400);
        }
    }

    /**
     * Updates the given annotation.
     * Returns the annotation, if update was successful.
     */
    function annotation_put()
    {

        $id = $this->put('id');
        if (!$id)
        {
            $this->response(array('error' => 'No id provided'), 400);
        }

        $data = array(
            'id' => $id,
            'start_message_id' => $this->put('start_message_id'),
            'end_message_id' => $this->put('end_message_id'),
            'memo' => $this->put('memo'),
            'user_id' => $this->put('user_id'),
            'parent_id' => $this->put('parent_id')
        );

        $this->load->model('data/Annotations_model');
        $data = $this->Annotations_model->update_data($id, $data);
        if ($data)
        {
            $this->response($data, 201);
        }
        else
        {
            $this->response(array('error' => 'Annotation not updated'), 400);
        }
    }

    /**
     * Gets the thread that contains the annotation given by seed_id
     */
    function thread_get()
    {
        $seed_id = $this->get('seed_id');
        if (!$seed_id)
        {
            $this->response(array('error' => 'No seed annotation id provided'), 400);
        }

        $this->load->model('data/Annotations_model');
        $data = $this->Annotations_model->get_thread($seed_id);

        if ($data)
        {
            $this->response($data, 200);
        }
        else
        {
            $this->response(array('error' => 'Thread could not be recovered'), 404);
        }
    }

    //TODO: how exactly will we need to request threads?
}
