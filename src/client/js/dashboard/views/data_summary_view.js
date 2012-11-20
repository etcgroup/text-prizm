define(['jquery', 'marionette',
    'text!../templates/data_summary.html',
    'common/helpers/all'],
    function($, Marionette, dataSummaryTemplate, Helpers) {

        /**
         * A view summarizing information about the data set.
         */
        var DatSetSummaryView = Marionette.ItemView.extend({
            template: dataSummaryTemplate,
            templateHelpers: Helpers,
            modelEvents: {
                'change': 'modelChanged'
            },

            modelChanged: function() {
                this.render();
            }
        });

        return DatSetSummaryView;
    });
