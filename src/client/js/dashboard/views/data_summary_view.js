define(['marionette',
    'text!../templates/data_summary.html',
    'common/helpers'],
    function(Marionette, dataSummaryTemplate, Helpers) {

        /**
         * A view summarizing information about the data set.
         */
        var DatSetSummaryView = Marionette.ItemView.extend({
            template: dataSummaryTemplate,
            templateHelpers: Helpers
        });

        return DatSetSummaryView;
    });
