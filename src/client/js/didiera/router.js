define(["marionette"],
    function(Marionette) {

        /**
         * The url mappings for didi
         */
        var DidiRouter = Marionette.AppRouter.extend({
            appRoutes: {
                '' : 'start'
            }
        });

        return DidiRouter;

    });
