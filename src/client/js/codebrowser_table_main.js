require(['common_config', 'lib/jquery', 'lib/jquery.dataTables'],
    function(config, $) {
        $('#overview').dataTable({
            "bPaginate": false
        });
    });