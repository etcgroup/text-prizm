<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Codes_model extends Base_model {

    var $table = 'coding_codes';

    function __construct()
    {
        parent::__construct();
    }

    /**
     * Deletes the code, if it has no children or instances.
     * @param type $id
     */
    function delete($id)
    {
        //No deleting if you have kids
        $children = $this->get_children($id);
        if (count($children) > 0)
        {
            return false;
        }

        //No deleting if you have instances
        $code = $this->get($id);
        if ($code['active_instances'] > 0)
        {
            return false;
        }

        //Ok, you can delete...
        //First remove any relationships where this is the child
        if ($this->db->delete('coding_relationships', array('child_code_id' => $id)))
        {
            //And finally delete the code itself
            return parent::delete($id);
        }
    }

    /**
     * Creates a new code.
     * @param type $start_message_id
     * @param type $end_message_id
     * @param type $memo
     * @param type $user_id
     * @param type $parent_id
     * @return type
     */
    function insert($name, $schema_id, $description = null)
    {
        $data = array(
            'name' => $name,
            'schema_id' => $schema_id,
            'description' => $description,
            'active_instances' => 0
        );
        $data = $this->insert_data($data);

        return $data;
    }

    function get_parents($id)
    {
        $parents = array();

        while (true)
        {
            $this->db->select('coding_codes.*');
            $this->db->from('coding_codes');
            $this->db->join('coding_relationships', 'id = parent_code_id');
            $this->db->where('child_code_id', $id);
            $query = $this->db->get();

            if ($query->num_rows() > 0)
            {
                $result = $query->row();
                array_push($parents, $result);
                $id = $result->id;
            }
            else
            {
                break;
            }
        }

        return $parents;
    }

    /**
     * Gets the immediate parent of the code.
     * @param type $id
     */
    function get_parent($id)
    {
        $this->db->select('coding_codes.*');
        $this->db->from('coding_codes');
        $this->db->join('coding_relationships', 'id = parent_code_id');
        $this->db->where('child_code_id', $id);
        $query = $this->db->get();

        if ($query->num_rows() > 0)
        {
            $result = $query->row();
            return $result;
        }
        else
        {
            return null;
        }
    }

    /**
     * Increments the active instance count on this code and its parents
     * @param type $id
     */
    function increment_instances($id)
    {
        return $this->adjust_instances($id, 1);
    }

    /**
     * Decrements the active instance count on this code and its parents
     * @param type $id
     */
    function decrement_instances($id)
    {
        return $this->adjust_instances($id, -1);
    }

    function adjust_instances($id, $amount)
    {
        $me = $this->get($id);
        $parents = $this->get_parents($id);
        $parents[] = $me;

        $update_str = 'active_instances ';
        if ($amount > 0)
        {
            $update_str .= '+' . $amount;
        }
        elseif ($amount < 0)
        {
            $update_str .= $amount;
        }
        else
        {
            return true;
        }

        foreach ($parents as $code)
        {
            $this->db->where('id', $code->id);
            $this->db->set('active_instances', $update_str, FALSE);
            $this->db->update('coding_codes');
        }

        return TRUE;
    }

    function set_parent($id, $parent_id)
    {
        $data = array(
            'child_code_id' => $id,
            'parent_code_id' => $parent_id
        );

        $code = $this->get($id);

        $query = $this->db->get_where('coding_relationships', array('child_code_id' => $id));
        if ($query->num_rows() > 0)
        {
            //Decrement the instance count on the parents
            $rel = $query->row();
            $old_parent_id = $rel->parent_code_id;
            if ($old_parent_id != 0)
            {
                $this->adjust_instances($old_parent_id, - $code->active_instances);
            }
        }

        if ($parent_id == NULL || $parent_id == 0)
        {
            //Delete the old entry entirely
            $this->db->where('child_code_id', $id);
            if ($this->db->delete('coding_relationships'))
            {
                return $this->get($id);
            }
        }
        elseif ($query->num_rows() > 0)
        {
            //Update the old relationship
            $this->db->where('child_code_id', $id);
            if ($this->db->update('coding_relationships', $data))
            {
                $this->adjust_instances($parent_id, $code->active_instances);
                return $this->get($id);
            }
        }
        else
        {
            //Insert a new relationships
            if ($this->db->insert('coding_relationships', $data))
            {
                $this->adjust_instances($parent_id, $code->active_instances);
                return $this->get($id);
            }
        }
    }

    function get_children($id)
    {
        $this->db->select('coding_codes.*');
        $this->db->from('coding_codes');
        $this->db->join('coding_relationships', 'id = child_code_id');
        $this->db->where('parent_code_id', $id);
        $query = $this->db->get();

        $result = $query->result();

        return $result;
    }
    
    function pair_metrics($ids){
        $id_a = $ids["id_a"];
        $id_b = $ids["id_b"];
        // TODO unfake this
        $result = array(
            "id_a" => $id_a,
            "id_b" => $id_b,
            "cooccur" => 1,
            "condis" => 45,
            "foo" => 678,
            "label" => "coda a x code b");
        return $result;
    }

}
