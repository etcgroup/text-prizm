define(['marionette',
    '../models/data_set',
    'text!../templates/data_set_summary.html'],
    function(Marionette, DataSet, dataSetSummaryTemplate) {

        var DatSetSummaryView = Marionette.ItemView.extend({
            template: dataSetSummaryTemplate,
            initialize: function() {
                this.model = new DataSet();
                this.model.fetch();
            }
        });

        return DatSetSummaryView;
    });