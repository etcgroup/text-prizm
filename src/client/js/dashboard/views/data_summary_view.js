define(['marionette',
    'common/models/data_counts',
    'text!../templates/data_summary.html',
    'common/helpers'],
    function(Marionette, DataCounts, dataSummaryTemplate, Helpers) {

        /**
         * A view summarizing information about the data set.
         */
        var DatSetSummaryView = Marionette.ItemView.extend({
            template: dataSummaryTemplate,
            templateHelpers: Helpers,
            initialize: function() {
                //Temporarily load the model with fake data
                this.model = new DataCounts({
                    messages: 3506134,
                    participants: 673,
                    codes: 46,
                    clusters: 1002,
                    coded_messages: 23015,
                    coded_messages_recent: 1324,
                    coders: 12,
                    coders_recent: 3,
                    memos: 32,
                    memos_recent: 4,
                    recency: 30
                });
                //this.model.fetch();
            }
        });

        return DatSetSummaryView;
    });
