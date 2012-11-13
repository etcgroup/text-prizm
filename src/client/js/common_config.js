(function() {
    if (typeof require === 'undefined') {
        //If there is no require yet (i.e. we're loading the config
        //on the page, before require.js) then we need to set up
        //this little hack.
        var require = {
            config: function(req_config) {
                window.require = req_config;
                //Simulate var require = {...}
            }
        }
    }

    //It is important that we use this exact call, hence
    //the hack above.
    require.config({
        paths: {
            'backbone': 'lib/backbone',
            'text': 'lib/requirejs-text',
            'underscore': 'lib/underscore',
            'marionette': 'marionette-wrapper',
            'jquery' : 'lib/jquery',
            'jqueryui' : 'lib/jqueryui',
            'jquery.event.drag' : 'lib/jquery.event.drag',
            'jquery.event.drop' : 'lib/jquery.event.drop'
        },
        shim: {
            'lib/jquery': {
                exports: 'jQuery'
            },
            'lib/color': {
                exports: 'net.brehaut.Color'
            },
            'lib/date': {
                exports: 'Date'
            },
            'lib/d3': {
                exports: 'd3'
            },
            'lib/colorbrewer': {
                exports: 'colorbrewer'
            },
            'util/etc-graph': {
                exports: 'ETC'
            },
            'lib/slick.core': {
                exports: 'Slick',
                deps: ['jquery']
            },
            'lib/slick.grid': {
                exports: 'Slick.Grid',
                deps: ['jquery.event.drag',
                'jquery.event.drop']
            },
            'util/jquery.ui.selectable': ['jquery', 'jqueryui']
        }
    });
})();