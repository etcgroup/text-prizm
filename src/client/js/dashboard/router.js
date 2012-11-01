define(["marionette"],
    function(Marionette) {

        /**
         * The url mappings for the dashboard
         */
        var DashboardRouter = Marionette.AppRouter.extend({
            appRoutes: {
                '' : 'start'
            }
        });

        return DashboardRouter;

    });