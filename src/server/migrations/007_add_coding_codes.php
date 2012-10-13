<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Creates the 'coding_codes' table.
 * Fields: id, name, description, active_instances, schema_id, code_type
 */
class Migration_Add_coding_codes extends CI_Migration {

    public function up()
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

    public function down()
    {
        $this->dbforge->drop_table('coding_codes');
    }

}