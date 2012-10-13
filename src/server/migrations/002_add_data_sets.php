<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Creates the 'data_sets' table.
 * Fields: id, name, created
 */
class Migration_Add_data_sets extends CI_Migration {

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
                'constraint' => '100',
            ),
            'created' => array(
                'type' => 'DATETIME',
            )
        ));

        //Add the primary key
        $this->dbforge->add_key('id', TRUE);

        //Create the table
        $this->dbforge->create_table('data_sets');
    }

    public function down()
    {
        $this->dbforge->drop_table('data_sets');
    }

}