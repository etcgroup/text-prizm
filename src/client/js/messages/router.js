define(["marionette"],
    function(Marionette) {

        /**
         * The url mappings for the messages
         */
        var MessagesRouter = Marionette.AppRouter.extend({
            appRoutes: {
                '' : 'start',
                'cluster/:id': 'startById',
                'start/:start': 'startByDate'
            }
        });

        return MessagesRouter;

    });
