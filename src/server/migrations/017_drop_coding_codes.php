<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Drop the 'coding_codes' table.
 * Fields: id, name, description, active_instances, schema_id, code_type
 */
class Migration_Drop_coding_codes extends CI_Migration {

    public function up()
    {
        //Make sure coding_codes is empty
        $coding_codes_count = $this->db->count_all('coding_codes');
        if ($coding_codes_count > 0)
        {
            show_error('Table `coding_codes` was not empty.');
        }
        
        $this->dbforge->drop_table('coding_codes');
    }

    public function down()
    {
        //Create the fields
        $this->dbforge->add_field(array(
            'id' => array(
                'type' => 'INT',
                'unsigned' => TRUE,
                'auto_increment' => TRUE
            ),
            'name' => array(
                'type' => 'VARCHAR',
                'constraint' => 200
            ),
            'description' => array(
                'type' => 'TEXT'
            ),
            'active_instances' => array(
                'type' => 'INT',
                'unsigned' => TRUE,
                'default' => 0
            ),
            'schema_id' => array(
                'type' => 'INT'
            ),
            'code_type' => array(
                'type' => 'INT',
                'default' => 0
            ),
        ));

        //Add the primary key
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key('schema_id');

        //Create the table
        $this->dbforge->create_table('coding_codes');
    }

}