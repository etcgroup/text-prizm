<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Creates the 'activities' table.
 * Fields: id, user_id, time, activity_type, data
 */
class Migration_Add_activities extends CI_Migration {

    public function up()
    {

        //Create the fields
        $this->dbforge->add_field(array(
            'id' => array(
                'type' => 'INT',
                'unsigned' => TRUE,
                'auto_increment' => TRUE
            ),
            'user_id' => array(
                'type' => 'INT',
                'unsigned' => TRUE
            ),
            'time' => array(
                'type' => 'DATETIME'
            ),
            'activity_type' => array(
                'type' => 'VARCHAR',
                'constraint' => 200
            ),
            'data' => array(
                'type' => 'TEXT'
            )
        ));

        //Add the primary key
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key('time');

        //Create the table
        $this->dbforge->create_table('activities');
    }

    public function down()
    {
        $this->dbforge->drop_table('activities');
    }

}