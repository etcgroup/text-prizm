define(['marionette',
    'common/models/app_status',
    'text!../templates/app_status.html'],
    function(Marionette, AppStatus, appStatusTemplate) {

        /**
         * A view summarizing the status of the app.
         */
        var AppStatusView = Marionette.ItemView.extend({
            template: appStatusTemplate,
            initialize: function() {
                this.model = new AppStatus();
                this.model.fetch();
            }
        });

        return AppStatusView;
    });
