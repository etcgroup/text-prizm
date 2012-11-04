define(['marionette',
    'common/models/data_set',
    'text!../templates/data_summary.html'],
    function(Marionette, DataSet, dataSummaryTemplate) {

        /**
         * A view summarizing information about the data set.
         */
        var DatSetSummaryView = Marionette.ItemView.extend({
            template: dataSummaryTemplate,
            initialize: function() {
                this.model = new DataSet();
                this.model.fetch();
            }
        });

        return DatSetSummaryView;
    });
