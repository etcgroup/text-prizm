<?php

defined('BASEPATH') OR exit('No direct script access allowed');

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class CodingStats extends API_Controller {

    function __construct()
    {
        parent::__construct();
    }

    // coding instance stats
    function codingfreq_get()
    {
        $query = $this->db->query(<<<EOD
select a.date as date, a.dpcnt as cnt, coalesce(b.cicnt,0) as codecnt, coalesce(b.codedlinecount,0) as linescoded, (coalesce(b.codedlinecount,0) * 100/a.dpcnt) as pctcoded from
(select DATE(dp.time) as date, 0 as cicnt, count(dp.id) as dpcnt
from data_points dp
group by DATE(dp.time)) a
left outer join
(select DATE(dp.time) as date, count(ci.id) as cicnt, count(distinct dp.id) as codedlinecount
from coding_instances ci, data_points dp
where dp.id = ci.message_id
group by DATE(dp.time)) b
on a.date=b.date
EOD
        );

        $this->response($query->result_array(), 200);
    }

    // coding instance stats
    function codingfreqpeople_get()
    {
        $query = $this->db->query(<<<EOD
select a.date as date,
        a.dpcnt as cnt,
        coalesce(b.cicnt,0) as codecnt,
        coalesce(b.codedlinecount,0) as linescoded,
        (coalesce(b.codedlinecount,0) * 100/a.dpcnt) as pctcoded
from
    (select DATE(dp.time) as date, 0 as cicnt, count(dp.id) as dpcnt
    from data_points dp
    where dp.type = 0 and dp.participant_id > 2
    group by DATE(dp.time)) a
left outer join
    (select DATE(dp.time) as date, count(ci.id) as cicnt, count(distinct dp.id) as codedlinecount
    from coding_instances ci, data_points dp
    where dp.id = ci.message_id
    and dp.type = 0 and dp.participant_id > 2
    group by DATE(dp.time)) b
on a.date=b.date
EOD
        );

        $this->response($query->result_array(), 200);
    }

    function linescodedbyperson_get()
    {

        $query = $this->db->query(<<<EOD
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

        $this->response($query->result_array(), 200);
    }

    function lastweeklinesbyperson_get()
    {
        $query = $this->db->query(<<<EOD
SELECT u.name as coder, count(distinct dp.id) AS codes
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

        $this->response($query->result_array(), 200);
    }

    function totallinescoded_get()
    {
        $query = $this->db->query(<<<EOD
                SELECT COUNT( DISTINCT dp.id ) AS cnt
FROM data_points dp
INNER JOIN coding_instances ci ON ci.message_id = dp.id
EOD
        );

        $this->response($query->result_array(), 200);
    }

}