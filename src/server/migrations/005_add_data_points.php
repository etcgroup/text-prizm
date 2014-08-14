<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Creates the 'data_points' table.
 * Fields: id, session_id, idx, time, type, participant_id, message
 */
class Migration_Add_data_points extends CI_Migration {

    public function up()
    {

        //Create the fields
        $this->dbforge->add_field(array(
            'id' => array(
                'type' => 'INT',
                'unsigned' => TRUE,
                'auto_increment' => TRUE
            ),
            'session_id' => array(
                'type' => 'INT',
                'unsigned' => TRUE
            ),
            'idx' => array(
                'type' => 'INT',
                'unsigned' => TRUE
            ),
            'time' => array(
                'type' => 'DATETIME'
            ),
            'type' => array(
                'type' => 'INT'
            ),
            'participant_id' => array(
                'type' => 'INT',
                'unsigned' => TRUE
            ),
            'message' => array(
                'type' => 'text'
            )
        ));

        //Add the primary key
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key('time');
        $this->dbforge->add_key('participant_id');

        //Create the table
        $this->dbforge->create_table('data_points');

        //Create the compound index
        $this->db->query('CREATE INDEX session_id_participant_id ON data_points (session_id, participant_id)');

        //Make a fulltext index for searching
        # $this->db->query('CREATE FULLTEXT INDEX message_text ON data_points (message)');
    }

    public function down()
    {
        $this->dbforge->drop_table('data_points');
    }

}