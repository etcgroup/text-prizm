<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Creates the 'coding_ratings' table.
 * Fields: id, message_id, user_id, rating, updated
 */
class Migration_Add_coding_ratings extends CI_Migration {

    public function up()
    {

        //Create the fields
        $this->dbforge->add_field(array(
            'id' => array(
                'type' => 'INT',
                'unsigned' => TRUE,
                'auto_increment' => TRUE
            ),
            'message_id' => array(
                'type' => 'INT',
                'unsigned' => TRUE
            ),
            'user_id' => array(
                'type' => 'INT',
                'unsigned' => TRUE
            ),
            'rating' => array(
                'type' => 'INT'
            ),
            'updated' => array(
                'type' => 'DATETIME'
            ),
        ));

        //Add the primary key
        $this->dbforge->add_key('id', TRUE);

        //Create the table
        $this->dbforge->create_table('coding_ratings');

        //Make a unique index
        $this->db->query('CREATE UNIQUE INDEX message_id_user_id ON coding_ratings (message_id, user_id)');
    }

    public function down()
    {
        $this->dbforge->drop_table('coding_ratings');
    }

}