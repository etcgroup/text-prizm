<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Drops the 'coding_relationships' table.
 * Fields: parent_code_id, child_code_id
 */
class Migration_Drop_coding_relationships extends CI_Migration {

    public function up()
    {
        //Make sure coding_relationships is empty
        $coding_relationships_count = $this->db->count_all('coding_relationships');
        if ($coding_relationships_count > 0)
        {
            show_error('Table `coding_relationships` was not empty.');
        }
        $this->dbforge->drop_table('coding_relationships');
    }

    public function down()
    {
        //Create the fields
        $this->dbforge->add_field(array(
            'parent_code_id' => array(
                'type' => 'INT',
                'unsigned' => TRUE
            ),
            'child_code_id' => array(
                'type' => 'INT',
                'unsigned' => TRUE
            )
        ));

        //Add the primary key
        $this->dbforge->add_key('child_code_id', TRUE);

        //Create the table
        $this->dbforge->create_table('coding_relationships');
    }

}