<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Creates the 'coding_relationships' table.
 * Fields: parent_code_id, child_code_id
 */
class Migration_Add_coding_relationships extends CI_Migration {

    public function up()
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

    public function down()
    {
        $this->dbforge->drop_table('coding_relationships');
    }

}