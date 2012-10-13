<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Set_model extends Base_model {

    var $table = 'data_sets';

    function __construct()
    {
        parent::__construct();
    }

}
