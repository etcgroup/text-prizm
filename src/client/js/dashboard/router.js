define(["marionette"],
    function(Marionette) {

        var DashboardRouter = Marionette.AppRouter.extend({
            appRoutes: {
                '' : 'start'
            }
        });

        return DashboardRouter;

    });