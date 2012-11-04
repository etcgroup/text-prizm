define(['marionette',
    'common/models/data_counts',
    'text!../templates/data_summary.html'],
    function(Marionette, DataCounts, dataSummaryTemplate) {

        /**
         * A view summarizing information about the data set.
         */
        var DatSetSummaryView = Marionette.ItemView.extend({
            template: dataSummaryTemplate,
            initialize: function() {
                this.model = new DataCounts();
                this.model.fetch();
            }
        });

        return DatSetSummaryView;
    });
