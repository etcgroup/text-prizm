define(["textprizm",
    './router',
    './controller',
    'common/views/modal_region'],
    function(TextPrizm, DidiRouter, DidiController, ModalRegion) {

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
            machinesMonitor: '#machine-monitor-widget',
            modal: ModalRegion
        });

        // Now start the app
        var options = {

        };
        TextPrizm.start(options);
    });
