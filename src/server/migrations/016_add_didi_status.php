<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 */
class Migration_Add_didi_status extends CI_Migration {

    public function up()
    {
        //Create the fields
        $this->dbforge->add_field(array(
            'id' => array(
                'type' => 'INT',
                'unsigned' => TRUE,
                'auto_increment' => TRUE
            ),
            'task_id' => array(
                'type' => 'INT',
                'unsigned' => TRUE
            ),
            'job_id' => array(
                'type' => 'INT',
                'unsigned' => TRUE
            ),
            'started' => array(
                'type' => 'DATETIME'
            ),
            'updated' => array(
                'type' => 'DATETIME'
            ),
            'progress' => array(
                'type' => 'INT',
                'unsigned' => TRUE
            ),
            'failed' => array(
                'type' => 'TINYINT'
            )
        ));

        // Add the primary key
        $this->dbforge->add_key('id', TRUE);
        
        // add more indeces
        $this->dbforge->add_key('task_id');
        $this->dbforge->add_key('job_id');
        $this->dbforge->add_key('started');
        $this->dbforge->add_key('failed');
        
        //Create the table
        $this->dbforge->create_table('didi_status');
    }

    public function down()
    {
        $this->dbforge->drop_table('didi_status');
    }

}
