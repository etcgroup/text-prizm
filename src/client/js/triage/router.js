define(["marionette"],
    function(Marionette) {

        /**
         * The url mappings for the messages
         */
        var TriageRouter = Marionette.AppRouter.extend({
            appRoutes: {
                '' : 'start'
            }
        });

        return TriageRouter;

    });
