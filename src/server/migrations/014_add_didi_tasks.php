<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 */
class Migration_Add_didi_tasks extends CI_Migration {

    public function up()
    {
        //Create the fields
        $this->dbforge->add_field(array(
            'id' => array(
                'type' => 'INT',
                'unsigned' => TRUE,
                'auto_increment' => TRUE
            ),
            'task_type' => array(
                'type' => 'VARCHAR',
                'constraint' => 200
            ),
            'params_json' => array(
                'type' => 'TEXT'
            ),
            'hash' => array(
                'type' => 'VARCHAR',
                'constraint' => 200
            ),
            'finished' => array(
                'type' => 'TINYINT'
            ),
            'invalid' => array(
                'type' => 'TINYINT'
            )
        ));

        // Add the primary key
        $this->dbforge->add_key('id', TRUE);
        
        // add more indeces
        $this->dbforge->add_key('finished');
        $this->dbforge->add_key('invalid');
        $this->dbforge->add_key('hash');
        $this->dbforge->add_key('task_type');
        
        //Create the table
        $this->dbforge->create_table('didi_tasks');
    }

    public function down()
    {
        $this->dbforge->drop_table('didi_tasks');
    }

}
