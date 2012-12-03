<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 */
class Migration_Add_didi_jobs extends CI_Migration {

    public function up()
    {
        //Create the fields
        $this->dbforge->add_field(array(
            'id' => array(
                'type' => 'INT',
                'unsigned' => TRUE,
                'auto_increment' => TRUE
            ),
            'description' => array(
                'type' => 'TEXT'
            ),
            'task_id_list' => array(
                'type' => 'TEXT'
            ),
            'count' => array(
                'type' => 'INT',
                'unsigned' => TRUE
            ),
            'progress' => array(
                'type' => 'INT',
                'unsigned' => TRUE
            ),
            'user_id' => array(
                'type' => 'INT',
                'unsigned' => TRUE
            ),
            'added' => array(
                'type' => 'DATETIME'
            ),
            'paused' => array(
                'type' => 'TINYINT'
            )
        ));

        // Add the primary key
        $this->dbforge->add_key('id', TRUE);
        
        // add more indeces
        $this->dbforge->add_key('paused');
        $this->dbforge->add_key('added');
        
        //Create the table
        $this->dbforge->create_table('didi_jobs');
    }

    public function down()
    {
        $this->dbforge->drop_table('didi_jobs');
    }

}
