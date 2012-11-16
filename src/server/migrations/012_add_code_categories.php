<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Creates the 'code_categories' table.
 * Fields: id, code_id, category_id, weight
 */
class Migration_Add_code_categories extends CI_Migration {

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
            'category_id' => array(
                'type' => 'INT',
                'unsigned' => TRUE
            ),
            'weight' => array(
                'type' => 'FLOAT',
                'default' => '1.0'
            )
        ));

        //Add the primary key
        $this->dbforge->add_key('id', TRUE);

        //Create the table
        $this->dbforge->create_table('code_categories');
    }

    public function down()
    {
        $this->dbforge->drop_table('code_categories');
    }

}