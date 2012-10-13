<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Participants_model extends Base_model {

    var $table = 'data_participants';

    function __construct()
    {
        parent::__construct();
    }

}
