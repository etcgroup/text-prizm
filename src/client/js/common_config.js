require.config({
    paths: {
        'backbone': 'lib/backbone',
        'underscore': 'lib/underscore',
        'jquery' : 'lib/jquery',
        'jquery.event.drag' : 'lib/jquery.event.drag',
        'jquery.event.drop' : 'lib/jquery.event.drop'
    },
    shim: {
        'lib/backbone-relational': {
            deps: ['lib/backbone', 'lib/underscore'],
            exports: 'Backbone'
        },
        'lib/backbone': {
            deps: ['lib/underscore', 'lib/jquery'],
            exports: 'Backbone'
        },
        'lib/underscore': {
            exports: '_'
        },
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
            deps: ['lib/jquery']
        },
        'lib/slick.grid': {
            exports: 'Slick.Grid',
            deps: ['lib/jquery.event.drag',
            'lib/jquery.event.drop']
        },
        'util/jquery.ui.selectable': ['lib/jquery', 'lib/jqueryui']
    }
});