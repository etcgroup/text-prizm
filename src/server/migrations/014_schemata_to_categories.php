<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Converts coding_schemata and coding_codes.code_type into
 * categories.
 *
 * Each schema becomes two categories - one where code_type is 0,
 * and one where code_type is 1.
 *
 * Entries are added into code_categories linking coding_codes to
 * code_categories.
 *
 * Values in the target tables are cleared before the conversion (both ways).
 */
class Migration_Schemata_to_categories extends CI_Migration {

    public function up()
    {
        //Make sure categories is empty
        $categories_count = $this->db->count_all('categories');
        if ($categories_count > 0)
        {
            show_error('Table `categories` was not empty.');
        }
        //Make sure code_categories is empty
        $code_categories_count = $this->db->count_all('code_categories');
        if ($code_categories_count > 0)
        {
            show_error('Table `code_categories` was not empty.');
        }

        //Delete all categories
        $this->db->truncate('categories');
        //Delete all the code_categories
        $this->db->truncate('code_categories');

        //Get all of the schemata
        $schemata = $this->db->get('coding_schemata')->result();

        //Get the current maximum schema id value
        $max_id = 0;
        foreach ($schemata as $schema)
        {
            if ($max_id < $schema->id)
            {
                $max_id = $schema->id;
            }
        }

        foreach ($schemata as $schema)
        {
            //Map code types onto categories.
            //Code type = 0 maps to a category that is identical to the old schema.
            $code_type_to_category = array(
                0 => $schema,
                1 => (object) array(
                    'id' => $max_id + 1,
                    'name' => $schema->name . ' (affect)',
                    'description' => $schema->description . ' (affect)'
                )
            );
            //Increment the max_id since we've just used up another id
            $max_id = $max_id + 1;

            //Insert the new categories as a batch (the values in the $code_type_to_category map)
            $this->db->insert_batch('categories', array_values($code_type_to_category));

            //Get the codes in this schema
            $this->db->where('schema_id', $schema->id);
            $schema_codes = $this->db->get('coding_codes')->result();

            //Create an entry in code_categories for each one
            $code_categories = array();

            foreach ($schema_codes as $code)
            {
                //Get the category for this code
                $category = $code_type_to_category[$code->code_type];

                //Create a code_categories entry linking the code to the category
                $code_categories[] = array(
                    'code_id' => $code->id,
                    'category_id' => $category->id
                );
            }

            //Insert all of the code_categories at once
            $this->db->insert_batch('code_categories', $code_categories);

            //Delete all of the schemata
            $this->db->truncate('coding_schemata');
        }
    }

    public function down()
    {
        //Make sure coding_schemata is empty
        $schemata_count = $this->db->count_all('coding_schemata');
        if ($schemata_count > 0)
        {
            show_error('Table `coding_schemata` was not empty.');
        }

        //Get all of the categories
        $categories = $this->db->get('categories')->result();
        foreach ($categories as $category)
        {
            //Insert the category into coding_schemata
            $this->db->insert('coding_schemata', $category);

            //Update all of the codes in this category to use schema_id
            $update_data = array(
                'schema_id' => $category->id
            );
            $this->db->join('code_categories', 'code_categories.code_id = coding_codes.id');
            $this->db->where('coding_categories.category_id', $category->id);
            $this->db->update('coding_codes', $update_data);
        }

        //Delete all categories
        $this->db->truncate('categories');

        //Delete all of the code_categories
        $this->db->truncate('code_categories');
    }

}
