define(['marionette',
    'text!../templates/app_status.html',
    'common/helpers/all'],
    function(Marionette, appStatusTemplate, Helpers) {

        /**
         * A view summarizing the status of the app.
         */
        var AppStatusView = Marionette.ItemView.extend({
            template: appStatusTemplate,
            templateHelpers: Helpers,
            modelEvents: {
                'change': 'render'
            }
        });

        return AppStatusView;
    });
