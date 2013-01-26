define(["textprizm",
    './router',
    './controller'],
    function(TextPrizm, MessagesRouter, MessagesController) {

        TextPrizm.addInitializer(function() {
            //Set up the router & controller
            this.router = new MessagesRouter({
                controller: new MessagesController()
            });
        });

        // Set the regions for this app
        TextPrizm.addRegions({
            messageNavigator: '#message-navigator',
            messageViewer: '#message-viewer'
        });

        // Now start the app
        var options = {
            rootUrl: '/messages/'
        };
        TextPrizm.start(options);
    });
