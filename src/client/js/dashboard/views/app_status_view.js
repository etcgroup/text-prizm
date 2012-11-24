define(['common/views/loading_item_view',
    'text!../templates/app_status.html',
    'common/helpers/all'],
    function(LoadingItemView, appStatusTemplate, Helpers) {

        /**
         * A view summarizing the status of the app.
         */
        var AppStatusView = LoadingItemView.extend({
            template: appStatusTemplate,
            templateHelpers: Helpers,

            onModelChange: function() {
                this.render();
            }
        });

        return AppStatusView;
    });
