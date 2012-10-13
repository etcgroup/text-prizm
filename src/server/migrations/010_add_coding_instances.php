<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Creates the 'coding_instances' table.
 * Fields: id, code_id, message_id, user_id, added, task_id, intensity, flag
 */
class Migration_Add_coding_instances extends CI_Migration {

    public function up()
    {

        //Create the fields
        $this->dbforge->add_field(array(
            'id' => array(
                'type' => 'INT',
                'unsigned' => TRUE,
                'auto_increment' => TRUE
            ),
            'code_id' => array(
                'type' => 'INT',
                'unsigned' => TRUE
            ),
            'message_id' => array(
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
            'task_id' => array(
                'type' => 'INT',
                'unsigned' => TRUE,
                'null' => TRUE
            ),
            'intensity' => array(
                'type' => 'DOUBLE',
                'default' => 1
            ),
            'flag' => array(
                'type' => 'INT'
            )
        ));

        //Add the primary key
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key('message_id');
        $this->dbforge->add_key('code_id');

        //Create the table
        $this->dbforge->create_table('coding_instances');
    }

    public function down()
    {
        $this->dbforge->drop_table('coding_instances');
    }

}