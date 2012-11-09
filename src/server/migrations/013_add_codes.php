<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Creates the 'codes' table.
 * Fields: id, name, description, parent_id
 */
class Migration_Add_codes extends CI_Migration {

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
            'parent_id' => array(
                'type' => 'INT',
                'unsigned' => TRUE,
                'null' => TRUE
            )
        ));

        //Add the primary key
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key('parent_id');

        //Create the table
        $this->dbforge->create_table('codes');
    }

    public function down()
    {
        $this->dbforge->drop_table('codes');
    }

}