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
                //Temporarily load the model with fake data
                this.model = new DataCounts({
                    messages: 356134,
                    participants: 673,
                    codes: 46,
                    total_memos: 32,
                    recent_memos: 4,
                    clusters: 1002,
                    coded_messages: 23015,
                    active_coders: 3
                });
                //this.model.fetch();
            }
        });

        return DatSetSummaryView;
    });
