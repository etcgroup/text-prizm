<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Creates the 'didi_machines' table.
 * Fields: id, location, last_ping, is_busy
 * location contains ip:port and name contains some human-readable name
 */
class Migration_Add_didi_abilities extends CI_Migration {

    public function up()
    {

        //Create the fields
        $this->dbforge->add_field(array(
            'machine_id' => array(
                'type' => 'INT',
                'unsigned' => TRUE
            ),
            'task_type' => array(
                'type' => 'VARCHAR',
                'constraint' => 200
            )
        ));

        // Add the primary key
        $this->dbforge->add_key(array('machine_id', 'task_type'), TRUE);
        
        //Create the table
        $this->dbforge->create_table('didi_abilities');
    }

    public function down()
    {
        $this->dbforge->drop_table('didi_abilities');
    }

}
