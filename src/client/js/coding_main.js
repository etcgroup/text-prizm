require(['jquery', 'controllers/coding_controller'],
    function($, CodingController) {

        $(document).ready(function() {
            window.controller = new CodingController(window.coding_options);
        });
    });