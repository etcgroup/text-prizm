define(['backbone', 'marionette',
    '../views/pair_metrics_view',
    'text!../templates/pair_metrics_table.html'],
    function(Backbone, Marionette, PairMetricsView, pairMetricsTableTemplate) {

        /**
         * A view shown when no messages are loaded.
         */
        var EmptyPairMetricsView = Marionette.ItemView.extend({
            template: "<td>parp :(</td>",
            tagName: 'tr'
        });

        /**
         * A view that lists messages.
         */
        var PairMetricsTableView = Marionette.CompositeView.extend({
            template: pairMetricsTableTemplate,
            itemView: PairMetricsView,
            emptyView: EmptyPairMetricsView,
            itemViewContainer: 'tbody'
//            className: 'message-list-view',

          //  ui: {
          //      messageList: 'ul.message-list'
           // },

        });

        return PairMetricsTableView;
    });
