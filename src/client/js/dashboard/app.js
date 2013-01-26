define(["textprizm",
    './router',
    './controller'],
    function(TextPrizm, DashboardRouter, DashboardController) {

        TextPrizm.addInitializer(function() {
            //Set up the router & controller
            this.router = new DashboardRouter({
                controller: new DashboardController()
            });
        });

        // Set the regions for this app
        TextPrizm.addRegions({
            appStatus: '#app-status-widget',
            dataSetSummary: '#data-set-summary-widget',
            activities: '#activity-list'
        });

        // Now start the app
        var options = {
            rootUrl: '/textprizm/'
        };
        TextPrizm.start(options);
    });
