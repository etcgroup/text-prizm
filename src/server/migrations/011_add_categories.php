<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Creates the 'categories' table.
 * Fields: id, name, description
 */
class Migration_Add_categories extends CI_Migration {

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
            )
        ));

        //Add the primary key
        $this->dbforge->add_key('id', TRUE);

        //Create the table
        $this->dbforge->create_table('categories');
    }

    public function down()
    {
        $this->dbforge->drop_table('categories');
    }

}