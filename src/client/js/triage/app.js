define(["textprizm",
    './router',
    './controller'],
    function(TextPrizm, TriageRouter, TriageController) {

        TextPrizm.addInitializer(function() {
            //Set up the router & controller
            this.router = new TriageRouter({
                controller: new TriageController()
            });
        });

        // Set the regions for this app
        TextPrizm.addRegions({
            pairMetrics: '#pair-metrics'
        });

        // Now start the app
        var options = {
            rootUrl: 'triage'
        };
        TextPrizm.start(options);
    });
