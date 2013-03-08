define(['marionette', 'underscore',
    'common/helpers/all',
    'text!../templates/pair_metrics_item.html'],
    function(Marionette, _,
        Helpers, pairMetricsTemplate) {

        /**
         * A view that displays a single message.
         */
        var PairMetricsView = Marionette.ItemView.extend({
            template: pairMetricsTemplate,
            templateHelpers: Helpers,

            tagName: 'tr',
            className: 'pair-metrics',

            /*
            ui: {
                timeLink: '.time-link',
                appliedCodes: '.applied-code'
            },

            onRender: function() {
                this.ui.timeLink.tooltip({
                    placement: 'right'
                });
            } */
        });

        return PairMetricsView;
    });
