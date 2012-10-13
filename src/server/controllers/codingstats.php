<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class CodingStats extends CI_Controller {

    /**
     * Index Page for this controller.
     *
     * Maps to the following URL
     * 		http://example.com/index.php/welcome
     * 	- or -
     * 		http://example.com/index.php/welcome/index
     * 	- or -
     * Since this controller is set as the default controller in
     * config/routes.php, it's displayed at http://example.com/
     *
     * So any other public methods not prefixed with an underscore will
     * map to /index.php/welcome/<method_name>
     * @see http://codeigniter.com/user_guide/general/urls.html
     */
    public function index()
    {
        $args = array();

        //
        // unique lines coded
        //
            $args['total_lines_coded'] = $this->getQueryResult(<<<EOD
SELECT COUNT( DISTINCT dp.id ) AS cnt
FROM data_points dp
INNER JOIN coding_instances ci ON ci.message_id = dp.id
INNER JOIN coding_codes cc ON cc.id = ci.code_id
where cc.schema_id = 2
EOD
                , 'cnt');


        //
        // unique lines coded
        //
            $args['last_weeks_codes'] = $this->getQueryResult(<<<EOD
SELECT COUNT( DISTINCT dp.id ) AS cnt
FROM data_points dp
INNER JOIN coding_instances ci ON ci.message_id = dp.id
INNER JOIN coding_codes cc ON cc.id = ci.code_id
where cc.schema_id = 2
and ci.added >= (NOW() - INTERVAL 7 DAY)
EOD
                , 'cnt');


        //
        // affect codes
        //
            $args['affect_code_count'] = $this->getQueryResult(<<<EOD
SELECT COUNT( DISTINCT dp.id ) AS cnt
FROM data_points dp
INNER JOIN coding_instances ci ON ci.message_id = dp.id
INNER JOIN coding_codes cc ON cc.id = ci.code_id
where cc.schema_id = 2
and ci.code_id != 66 and ci.code_id != 113;
EOD
                , 'cnt');



        //
        // lines by person: total
        //
            /*
          $args['lines_by_person_total'] = $this->getQueryArray( <<<EOD
          SELECT u.id as id, u.name as coder, count(distinct dp.id) AS codes
          FROM data_points dp
          inner join coding_instances ci on ci.message_id = dp.id
          INNER JOIN users u ON ci.user_id = u.id
          inner join coding_codes cc on cc.id = ci.code_id
          where cc.schema_id = 2
          GROUP BY u.id
          ORDER BY codes desc
          EOD
          );
         *
         */



        //
        // lines by person: week
        //
            /*
          $args['lines_by_person_week'] = $this->getQueryArray( <<<EOD
          SELECT u.id as id, u.name as coder, count(distinct dp.id) AS codes
          FROM data_points dp
          inner join coding_instances ci on ci.message_id = dp.id
          INNER JOIN users u ON ci.user_id = u.id
          inner join coding_codes cc on cc.id = ci.code_id
          where cc.schema_id = 2
          and ci.added >= (NOW() - INTERVAL 7 DAY)
          GROUP BY u.id
          ORDER BY codes desc
          EOD
          );
         *
         */


        //
        // lines by person
        //

            $args['lines_by_person'] = $this->getQueryArray(<<<EOD
select tbl1.id as id, tbl1.username as user, sum(tbl1.counts) total, sum(if(tbl1.date_added >= (NOW() - INTERVAL 30 DAY), tbl1.counts, 0)) as month, sum(if(tbl1.date_added >= (NOW() - INTERVAL 7 DAY), tbl1.counts, 0)) as week
from
(SELECT u.id as id, u.name as username, count(distinct dp.id) AS counts, DATE(ci.added) date_added
FROM coding_instances ci
inner join data_points dp on ci.message_id = dp.id
INNER JOIN users u ON ci.user_id = u.id
inner join coding_codes cc on cc.id = ci.code_id
where cc.schema_id = 2
GROUP BY id, date_added) as tbl1
group by id
EOD
        );




        //
        // codes by lines
        //

            $args['codes_by_line'] = $this->getQueryArray(<<<EOD
select tbl1.id as id, tbl1.code as code, sum(tbl1.counts) total, sum(if(tbl1.date_added >= (NOW() - INTERVAL 30 DAY), tbl1.counts, 0)) as month, sum(if(tbl1.date_added >= (NOW() - INTERVAL 7 DAY), tbl1.counts, 0)) as week

from
(SELECT cc.id as id, cc.name as code, count(distinct dp.id) AS counts, DATE(ci.added) date_added
FROM coding_instances ci
inner join data_points dp on ci.message_id = dp.id
inner join coding_codes cc on cc.id = ci.code_id
where cc.schema_id = 2
GROUP BY id, date_added) as tbl1
group by id
EOD
        );


        //
        // codes by date
        //
            /*
          $args['codes_by_date'] = $this->getQueryArray( <<<EOD
          SELECT ci.id as id, cc.name as code, count(distinct dp.id) AS counts, DATE(ci.added) date_added
          FROM coding_instances ci
          inner join data_points dp on ci.message_id = dp.id
          inner join coding_codes cc on cc.id = ci.code_id
          where cc.schema_id = 2
          GROUP BY id, date_added
          order by counts desc
          EOD
          );
         */

        $args['version'] = $this->config->item('version');
        $this->load->view('codingstats', $args);
    }

    private function getQueryArray($queryString)
    {
        $query = $this->db->query($queryString);
        $arr = $query->result_array();
        $query->free_result();

        return $arr;
    }

    private function getQueryResult($queryString, $col)
    {
        $query = $this->db->query($queryString);
        $ret = null;
        if ($query->num_rows() > 0)
        {
            $row = $query->row_array();
            $ret = $row[$col];
        }
        $query->free_result();

        return $ret;
    }

}

?>
