<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Drops the 'coding_schemata' table.
 * Fields: id, name, description
 */
class Migration_Drop_coding_schemata extends CI_Migration {

    public function up()
    {
        //Make sure coding_schemata is empty
        $coding_schemata_count = $this->db->count_all('coding_schemata');
        if ($coding_schemata_count > 0)
        {
            show_error('Table `coding_schemata` was not empty.');
        }

        $this->dbforge->drop_table('coding_schemata');

    }

    public function down()
    {
        //Create the fields
        $this->dbforge->add_field(array(
            'id' => array(
                'type' => 'INT',
                'unsigned' => TRUE,
                'auto_increment' => TRUE
            ),
            'name' => array(
                'type' => 'VARCHAR',
                'constraint' => 200
            ),
            'description' => array(
                'type' => 'text'
            )
        ));

        //Add the primary key
        $this->dbforge->add_key('id', TRUE);

        //Create the table
        $this->dbforge->create_table('coding_schemata');
    }

}