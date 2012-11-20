define(['common/views/loading_item_view',
    'text!../templates/data_summary.html',
    'common/helpers/all'],
    function(LoadingItemView, dataSummaryTemplate, Helpers) {

        /**
         * A view summarizing information about the data set.
         */
        var DatSetSummaryView = LoadingItemView.extend({
            template: dataSummaryTemplate,
            templateHelpers: Helpers,

            onModelChange: function() {
                this.render();
            }
        });

        return DatSetSummaryView;
    });
