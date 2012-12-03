<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 */
class Migration_Add_features extends CI_Migration {

    public function up()
    {
        //Create the fields
        $this->dbforge->add_field(array(
            'id' => array(
                'type' => 'INT',
                'unsigned' => TRUE,
                'auto_increment' => TRUE
            ),
            'didi_task_id' => array(
                'type' => 'INT',
                'unsigned' => TRUE
            ),
            'message_id' => array(
                'type' => 'INT',
                'unsigned' => TRUE
            ),
            'name' => array(
                'type' => 'INT',
                'unsigned' => TRUE
            ),
            'value' => array(
                'type' => 'TEXT'
            )
        ));

        // Add the primary key
        $this->dbforge->add_key('id', TRUE);
        
        // add more indeces
        $this->dbforge->add_key('name');
        $this->dbforge->add_key('didi_task_id');
        
        //Create the table
        $this->dbforge->create_table('features');
    }

    public function down()
    {
        $this->dbforge->drop_table('features');
    }

}
