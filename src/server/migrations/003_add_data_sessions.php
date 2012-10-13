<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Creates the 'data_sessions' table.
 * Fields: id, set_id, started, ended
 */
class Migration_Add_data_sessions extends CI_Migration {

    public function up()
    {

        //Create the fields
        $this->dbforge->add_field(array(
            'id' => array(
                'type' => 'INT',
                'unsigned' => TRUE,
                'auto_increment' => TRUE
            ),
            'set_id' => array(
                'type' => 'INT',
                'unsigned' => TRUE,
            ),
            'started' => array(
                'type' => 'DATETIME'
            ),
            'ended' => array(
                'type' => 'DATETIME'
            )
        ));

        //Add the primary key
        $this->dbforge->add_key('id', TRUE);

        //Create the table
        $this->dbforge->create_table('data_sessions');
    }

    public function down()
    {
        $this->dbforge->drop_table('data_sessions');
    }

}