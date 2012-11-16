<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Converts the coding_codes table to codes.
 * This just involves a straight copy except for certain columns.
 */
class Migration_Coding_codes_to_codes extends CI_Migration {

    public function up()
    {
        //Make sure codes is empty
        $codes_count = $this->db->count_all('codes');
        if ($codes_count > 0)
        {
            show_error('Table `codes` was not empty.');
        }

        //Get id, name, description, and parent_id fields into codes
        $this->db->query(
                'INSERT INTO `codes` (`id`, `name`, `description`, `parent_id`)
                    SELECT `coding_codes`.`id`,
                        `coding_codes`.`name`,
                        `coding_codes`.`description`,
                        `coding_relationships`.`parent_code_id` AS `parent_id`
                    FROM `coding_codes`
                    LEFT JOIN `coding_relationships`
                    ON `coding_codes`.`id` = `coding_relationships`.`child_code_id`');

        //Delete all the coding_codes
        $this->db->truncate('coding_codes');

        //Delete all the coding_relationships
        $this->db->truncate('coding_relationships');
    }

    public function down()
    {
        //Make sure coding_codes is empty
        $coding_codes_count = $this->db->count_all('coding_codes');
        if ($coding_codes_count > 0)
        {
            show_error('Table `coding_codes` was not empty.');
        }

        //Make sure coding_relationships is empty
        $coding_relationships_count = $this->db->count_all('coding_relationships');
        if ($coding_relationships_count > 0)
        {
            show_error('Table `coding_relationships` was not empty.');
        }

        //First extract all of the coding_relationships
        $this->db->query(
                'INSERT INTO `coding_relationships` (`parent_code_id`, `child_code_id`)
                    SELECT `codes`.`parent_id` AS `parent_code_id`,
                        `codes`.`id` AS `child_code_id`
                    FROM `codes`
                    WHERE `codes`.`parent_id` IS NOT NULL');

        //Then get all of the codes
        $this->db->query(
                'INSERT INTO `coding_codes` (`id`, `name`, `description`)
                    SELECT `codes`.`id`,
                        `codes`.`name`,
                        `codes`.`description`
                    FROM `codes`');

        //Delete entries in codes
        $this->db->truncate('codes');
    }

}
