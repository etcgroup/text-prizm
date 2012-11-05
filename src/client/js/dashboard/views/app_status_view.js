define(['marionette',
    'common/models/app_status',
    'text!../templates/app_status.html',
    'common/helpers'],
    function(Marionette, AppStatus, appStatusTemplate, Helpers) {

        /**
         * A view summarizing the status of the app.
         */
        var AppStatusView = Marionette.ItemView.extend({
            template: appStatusTemplate,
            templateHelpers: Helpers,
            initialize: function() {
                //Temporarily load the model with fake data
                this.model = new AppStatus({
                    name: 'Text Prizm',
                    version: '0.4.3',
                    revision: '677c23da83b51cb17598d692fbd4f482ca258d2c',
                    github_url: 'https://github.com/etcgroup/text-prism',
                    upgrade_time: 1352099002,
                    database_host: 'localhost:3306',
                    database_schema: 'textprizm'
                });
                //this.model.fetch();
            }
        });

        return AppStatusView;
    });
