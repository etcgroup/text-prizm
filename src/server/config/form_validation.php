<?php

$extract_create = array(
    array(
        'field' => 'name',
        'label' => 'Name',
        'rules' => 'trim|required|min_length[3]|max_length[255]|is_unique[extractors.name]|xss_clean'
    ),
    array(
        'field' => 'description',
        'label' => 'Description',
        'rules' => 'trim|required|min_length[10]|max_length[255]|xss_clean'
    )
);

$extract_edit = array(
    array(
        'field' => 'id',
        'label' => 'hidden id field',
        'rules' => 'required|integer'
    ),
    array(
        'field' => 'type',
        'label' => 'Extractor type',
        'rules' => 'required|integer'
    ),
    array(
        'field' => 'filters[time][from]',
        'label' => 'Time From',
        'rules' => 'required|callback__time_filter'
    ),
    array(
        'field' => 'filters[time][to]',
        'label' => 'Time To',
        'rules' => 'required|callback__time_filter'
    ),
    array(
        'field' => 'filters[participants_excluded][]',
        'label' => 'Participants',
        'rules' => 'integer'
    ),
    array(
        'field' => 'type',
        'label' => 'Extractor Type',
        'rules' => 'required|integer'
    ),
    array(
        'field' => 'body',
        'label' => 'Definition',
        'rules' => 'callback__valid_body'
    )
);
//Editing can also change the description
$extract_edit[] = $extract_create[1];


$runs_create = array(
    array(
        'field' => 'run_type',
        'label' => 'Run Type',
        'rules' => 'required|integer'
    ),
    array(
        'field' => 'random_seed',
        'label' => 'Random Seed',
        'rules' => 'required|integer'
    )
);



$config = array(
    'extract/create' => $extract_create,
    'extract/edit' => $extract_edit,
    'runs/create' => $runs_create
);