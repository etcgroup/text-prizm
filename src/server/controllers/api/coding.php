<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Coding extends API_Controller {

    function __construct()
    {
        parent::__construct();
    }

    // CODES

    function code_get()
    {
        if (!$this->get('id'))
        {
            $this->response(array('error' => 'No id provided'), 400);
        }

        $this->load->model('coding/Codes_model');
        $data = $this->Codes_model->get($this->get('id'));

        if ($data)
        {
            $this->response($data, 200);
        }
        else
        {
            $this->response(array('error' => 'Code could not be found'), 404);
        }
    }

    /**
     * Gets all the codes, subject to filters. Unless 'all' is set, only
     * those codes with active instances will be returned.
     */
    function codes_get()
    {
        $this->load->model('coding/Codes_model');

        $filter = $this->build_filter($this->get(), array(
            'schema_id', 'name_like', 'all', 'active_instances',
            'active_instances_from', 'active_instances_to'
                ));

        if (!key_exists('all', $filter))
        {
            $filter['active_instances >'] = 0;
        }
        else
        {
            unset($filter['all']);
        }

        $data = $this->Codes_model->get_all($filter);

        if ($data)
        {
            $this->response($data, 200); // 200 being the HTTP response code
        }
        else
        {
            $this->response(array('error' => 'Codes could not be found'), 404);
        }
    }

    /**
     * Inserts a new code.
     * Returns the code, if inserted.
     */
    function code_post()
    {
        $this->load->model('coding/Codes_model');

        $description = null;
        if ($this->post('description') !== false)
        {
            $description = $this->post('description');
        }

        $schema_id = 1;
        if ($this->post('schema_id'))
        {
            $schema_id = $this->post('schema_id');
        }

        $name = $this->post('name');

        $data = $this->Codes_model->insert($name, $schema_id, $description);

        if ($data)
        {
            $this->response($data, 201);
        }
        else
        {
            $this->response(array('error' => 'Code not created'), 400);
        }
    }

    /**
     * Updates the given code.
     * Returns the code, if update was successful.
     */
    function code_put()
    {

        $id = $this->put('id');
        if (!$id)
        {
            $this->response(array('error' => 'No id provided'), 400);
        }

        $data = array(
            'name' => $this->put('name'),
            'description' => $this->put('description'),
            'scheme_id' => $this->put('scheme_id')
        );

        $this->load->model('coding/Codes_model');
        $data = $this->Codes_model->update_data($id, $data);
        if ($data)
        {
            $this->response($data, 201);
        }
        else
        {
            $this->response(array('error' => 'Code not updated'), 400);
        }
    }

    /**
     * Deletes the given code.
     */
    function code_delete()
    {
        $id = $this->delete('id');
        if (!$id)
        {
            $this->response(array('error' => 'No id provided'), 400);
        }

        $this->load->model('coding/Codes_model');
        if ($this->Codes_model->delete($id))
        {
            $this->response(array('status' => true), 200);
        }
        else
        {
            $this->response(array('error' => 'Code not deleted. Check for children or instances.'), 200);
        }
    }

    // INSTANCES

    function instance_get()
    {
        if (!$this->get('id'))
        {
            $this->response(array('error' => 'No id provided'), 400);
        }

        $this->load->model('coding/Instances_model');
        $data = $this->Instances_model->get($this->get('id'));

        if ($data)
        {
            $this->response($data, 200);
        }
        else
        {
            $this->response(array('error' => 'Instance could not be found'), 404);
        }
    }

    /**
     * Gets all instances, subject to filters. Unless 'all' is a parameters,
     * only currently active instances will be provided.
     */
    function instances_for_get()
    {
        $this->load->model('coding/Instances_model');

        $filter = $this->build_filter($this->get(), array(
            'code_id', 'message_id', 'user_id', 'task_id', 'itensity', 'flag',
            'added_from', 'added_to',
            'itensity_from', 'intensity_to'
                ), true, $this->Instances_model->table);

        $points_filter = $this->build_filter($this->get(), array(
            'time_from', 'time_to',
            'idx_from', 'idx_to',
            'participant_id'
                ), false);

        $code_filter = $this->build_filter($this->get(), array(
            'schema_id'
                ), false);

        $data = $this->Instances_model->get_all_for_points($filter, $points_filter, $code_filter);
        if ($data !== NULL)
        {
            $this->response($data, 200); // 200 being the HTTP response code
        }
        else
        {
            $this->response(array('error' => 'Instances could not be found'), 404);
        }
    }

    function instances_get()
    {
        $this->load->model('coding/Instances_model');

        $filter = $this->build_filter($this->get(), array(
            'code_id', 'message_id', 'user_id', 'task_id', 'itensity', 'flag',
            'added_from', 'added_to',
            'itensity_from', 'intensity_to'
                ));

        $data = $this->Instances_model->get_all($filter);

        if ($data != null)
        {
            $this->response($data, 200); // 200 being the HTTP response code
        }
        else
        {
            $this->response(array('error' => 'Instances could not be found'), 404);
        }
    }

    function instance_post()
    {
        $this->load->model('coding/Instances_model');

        $code_id = $this->post('code_id');
        if (!$code_id)
        {
            $this->response(array('error' => 'No code id provided'), 400);
        }
        $message_id = $this->post('message_id');
        if (!$message_id)
        {
            $this->response(array('error' => 'No message id provided'), 400);
        }
        $user_id = $this->post('user_id');
        if (!$user_id)
        {
            $this->response(array('error' => 'No user id provided'), 400);
        }

        $task_id = NULL;
        if ($this->post('task_id'))
        {
            $task_id = $this - post('task_id');
        }

        $intensity = NULL;
        if ($this->post('intensity'))
        {
            $intensity = $this->post('intensity');
        }

        $flag = 0;
        if ($this->post('flag'))
        {
            $flag = $this->post('flag');
        }

        $data = $this->Instances_model->insert($code_id, $message_id, $user_id, $task_id, $intensity, $flag);

        if ($data != null)
        {
            $this->response($data, 201);
        }
        else
        {
            $this->response(array('error' => 'Code instance not created'), 400);
        }
    }

    /**
     * Update the flag status of the given instance.
     */
    function instance_put()
    {
        $id = $this->put('id');
        if (!$id)
        {
            $this->response(array('error' => 'No id provided'), 400);
        }

        $data = array(
            'flag' => $this->put('flag'),
        );

        $this->load->model('coding/Instances_model');
        $data = $this->Instances_model->update_data($id, $data);

        if ($data)
        {
            $this->response($data, 201);
        }
        else
        {
            $this->response(array('error' => 'Instance not updated'), 400);
        }
    }

    function instance_delete()
    {
        $id = $this->delete('id');
        if (!$id)
        {
            $this->response(array('error' => 'No id provided'), 400);
        }

        $this->load->model('coding/Instances_model');
        $result = $this->Instances_model->delete($id);
        if ($result)
        {
            $this->response($result, 200);
        }
        else
        {
            $this->response(array('error' => 'Instance not removed.'), 400);
        }
    }

    // SCHEMATA

    function schema_get()
    {
        if (!$this->get('id'))
        {
            $this->response(array('error' => 'No id provided'), 400);
        }

        $this->load->model('coding/Schemata_model');
        $data = $this->Schemata_model->get($this->get('id'));

        if ($data)
        {
            $this->response($data, 200);
        }
        else
        {
            $this->response(array('error' => 'Schema could not be found'), 404);
        }
    }

    function schemata_get()
    {
        $this->load->model('coding/Schemata_model');

        $filter = $this->build_filter($this->get(), array('name_like'));
        $data = $this->Schemata_model->get_all($filter);

        if ($data)
        {
            $this->response($data, 200); // 200 being the HTTP response code
        }
        else
        {
            $this->response(array('error' => 'Schemata could not be found'), 404);
        }
    }

    /**
     * Inserts a new schema.
     * Returns the schema, if inserted.
     */
    function schema_post()
    {
        $this->load->model('coding/Schemata_model');

        $description = null;
        if ($this->post('description'))
        {
            $description = $this->post('description');
        }

        $name = $this->post('name');

        $data = array(
            'name' => $name,
            'description' => $description
        );

        $data = $this->Schemata_model->insert_data($data);

        if ($data)
        {
            $this->response($data, 201);
        }
        else
        {
            $this->response(array('error' => 'Schema not created'), 400);
        }
    }

    function schema_put()
    {
        $id = $this->put('id');
        if (!$id)
        {
            $this->response(array('error' => 'No id provided'), 400);
        }

        $name = $this->put('name');
        if (!$name)
        {
            $this->response(array('error' => 'No name provided'), 400);
        }

        $data = array(
            'id' => $id,
            'name' => $name,
            'description' => $this->put('description')
        );

        $this->load->model('coding/Schemata_model');
        $data = $this->Schemata_model->update_data($id, $data);
        if ($data)
        {
            $this->response($data, 201);
        }
        else
        {
            $this->response(array('error' => 'Schema not updated'), 400);
        }
    }

    /**
     * Deletes the given schema, if it is empty.
     */
    function schema_delete()
    {
        $id = $this->delete('id');
        if (!$id)
        {
            $this->response(array('error' => 'No id provided'), 400);
        }

        $this->load->model('coding/Schemata_model');
        if ($this->Schemata_model->delete($id))
        {
            $this->response(array('status' => true), 200);
        }
        else
        {
            $this->response(array('error' => 'Schema not deleted. Maybe it still contains codes.'), 200);
        }
    }

    // RELATIONSHIPS

    /**
     * Gets all the codes that are parents of the given code id
     */
    function parents_get()
    {
        if (!$this->get('id'))
        {
            $this->response(array('error' => 'No id provided'), 400);
        }

        $this->load->model('coding/Codes_model');
        $data = $this->Codes_model->get_parents($this->get('id'));

        if ($data)
        {
            $this->response($data, 200);
        }
        else
        {
            $this->response(array('error' => 'Parent codes could not be found'), 404);
        }
    }

    /**
     * Gets all the codes that are direct children of the given code id
     */
    function children_get()
    {
        if (!$this->get('id'))
        {
            $this->response(array('error' => 'No id provided'), 400);
        }

        $this->load->model('coding/Codes_model');
        $data = $this->Codes_model->get_children($this->get('id'));

        if ($data)
        {
            $this->response($data, 200);
        }
        else
        {
            $this->response(array('error' => 'Child codes could not be found'), 404);
        }
    }

    /**
     * Updates the parent for the given code.
     * Returns the updated code, if update was successful.
     */
    function parent_put()
    {

        $id = $this->put('id');
        if (!$id)
        {
            $this->response(array('error' => 'No id provided'), 400);
        }

        $parent_id = null;
        if ($this->put('parent_id'))
        {
            $parent_id = $this->put('parent_id');
        }

        $this->load->model('coding/Codes_model');
        $data = $this->Codes_model->set_parent($id, $parent_id);
        if ($data)
        {
            $this->response($data, 201);
        }
        else
        {
            $this->response(array('error' => 'Code not updated'), 400);
        }
    }

}
