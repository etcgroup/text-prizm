require(['common_config', 'lib/jquery', 'controllers/coding_controller'],
    function(config, $, CodingController) {

        $(document).ready(function() {
            window.controller = new CodingController(window.coding_options);
        });
    });