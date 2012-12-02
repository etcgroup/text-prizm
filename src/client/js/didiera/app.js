define(["textprizm",
    './router',
    './controller'],
    function(TextPrizm, DidiRouter, DidiController) {

        TextPrizm.addInitializer(function() {
            //Set up the router & controller
            this.router = new DidiRouter({
                controller: new DidiController()
            });
        });

        // Set the regions for this app
        TextPrizm.addRegions({
            jobCreator: '#create-jobs-widget',
            jobsMonitor: '#job-monitor-widget',
            machinesMonitor: '#machine-monitor-widget'
        });

        // Now start the app
        var options = {

        };
        TextPrizm.start(options);
    });
