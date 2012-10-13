<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * REST_controller V 2.5.x
 *
 * @see https://github.com/philsturgeon/codeigniter-restserver
 *
 */
class API_Controller extends REST_Controller {

    function __construct()
    {
        parent::__construct();
    }

    /**
     * Looks in the parameters array for values matching
     * the names provided in the allowed array.
     * Special names: x_from, x_to, x_like
     * @param type $parameters
     * @param type $allowed
     * @return type
     */
    // _search=false&nd=1330250615071&rows=20&page=2&sidx=id&sord=desc
    function build_filter($parameters, $allowed, $include_defaults = true, $relative_table = NULL)
    {
        if ($include_defaults)
        {
            $default_allowed = array('limit', 'offset', 'order_by', 'count', 'grid');
        }
        else
        {
            $default_allowed = array();
        }

        if ($relative_table)
        {
            $default_parameters = array('order_by' => $relative_table . '.id');
        }
        else
        {
            $default_parameters = array('order_by' => 'id');
        }


        $parameters = array_merge($default_parameters, $parameters);
        $allowed = array_merge($default_allowed, $allowed);

        $filter = array();

        foreach ($allowed as $param)
        {
            if (key_exists($param, $parameters))
            {
                $filter_key = $param;
                $filter_value = $parameters[$param];
                if (preg_match('/(\\w+)_(from|to|like)/i', $param, $matches))
                {

                    $field = $matches[1];

                    if ($matches[2] == 'from')
                    {
                        $operator = '>=';
                    }
                    elseif ($matches[2] == 'to')
                    {
                        $operator = '<=';
                    }
                    elseif ($matches[2] == 'like')
                    {
                        $operator = 'like';
                    }

                    $filter_key = $field . ' ' . $operator;
                }

                $filter[$filter_key] = $filter_value;
            }
        }

        return $filter;
    }

    function order(&$order_by)
    {

    }

    function doResponse($data)
    {
        // valid data
        if ($data !== NULL)
        {
            if (is_array($data))
            {
                // a grid array will have a data key
                if (key_exists('data', $data))
                {
                    $page = $this->get('page');
                    if (!isset($page) || !is_int($page))
                    {
                        $page = 1;
                    }
                    $records = count($data['data']);
                    $total = $data['totalrows'];

                    $rows = array();
                    foreach ($data['data'] as $val)
                    {
                        $rows[] = array_values((array) $val);
                    }

                    $this->response(
                            array(
                        "page" => $page,
                        "records" => $records,
                        "total" => $total,
                        "rows" => $rows,
                        "cols" => $data['cols']
                            ), 200);
                }
                else
                {
                    $this->response($data, 200);
                }
            }
            else
            {
                $this->response('bad data set', 400);
            }
        }
        else
        {
            $this->response(array('error' => 'Sessions could not be found'), 404);
        }
    }

}