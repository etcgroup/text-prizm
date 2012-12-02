<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Creates the 'didi_machines' table.
 * Fields: id, location, last_ping, is_busy
 * location contains ip:port and name contains some human-readable name
 */
class Migration_Add_didi_machines extends CI_Migration {

    public function up()
    {

        //Create the fields
        $this->dbforge->add_field(array(
            'id' => array(
                'type' => 'INT',
                'unsigned' => TRUE,
                'auto_increment' => TRUE
            ),
            'location' => array(
                'type' => 'VARCHAR',
                'constraint' => 50
            ),
            'name' => array(
                'type' => 'VARCHAR',
                'constraint' => 50
            ),
            'last_ping' => array(
                'type' => 'DATETIME'
            ),
            'is_busy' => array(
                'type' => 'BOOL'
            )
        ));

        // Add the primary key
        $this->dbforge->add_key('id', TRUE);
        
        // Location is also a unique key
        $this->dbforge->add_key('location');

        //Create the table
        $this->dbforge->create_table('didi_machines');
    }

    public function down()
    {
        $this->dbforge->drop_table('didi_machines');
    }

}
