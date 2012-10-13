<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Creates the 'users' table.
 * Fields: id, name, full_name, email
 */
class Migration_Add_users extends CI_Migration {

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
            'full_name' => array(
                'type' => 'VARCHAR',
                'constraint' => '250',
            ),
            'email' => array(
                'type' => 'varchar',
                'constraint' => '250'
            )
        ));

        //Add the primary key
        $this->dbforge->add_key('id', TRUE);

        //Create the table
        $this->dbforge->create_table('users');
    }

    public function down()
    {
        $this->dbforge->drop_table('users');
    }

}