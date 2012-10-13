<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Schemata_model extends Base_model {

    var $table = 'coding_schemata';

    function __construct()
    {
        parent::__construct();
    }

    /**
     * Deletes the schema, if it is empty.
     * @param type $id
     * @return boolean
     */
    function delete($id)
    {

        //No deleting if you have codes
        $CI = & get_instance();
        $CI->load->model('coding/Codes_model');
        $filter = array(
            'schema_id' => $id,
            'count' => true
        );
        $result = $CI->Codes_model->get_all($filter);
        if ($result['count'] > 0)
        {
            return false;
        }

        //Delete the schema itself
        return parent::delete($id);
    }

}
