<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Creates the 'data_participants' table.
 * Fields: id, name, description
 */
class Migration_Add_data_participants extends CI_Migration {

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
                'type' => 'varchar',
                'constraint' => 100
            ),
            'description' => array(
                'type' => 'text'
            )
        ));

        //Add the primary key
        $this->dbforge->add_key('id', TRUE);

        //Create the table
        $this->dbforge->create_table('data_participants');
    }

    public function down()
    {
        $this->dbforge->drop_table('data_participants');
    }

}