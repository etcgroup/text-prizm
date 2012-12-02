define(['underscore',
    'textprizm',
    'common/collections/machine_collection',
    './views/machine_list_view',
    'common/collections/job_collection',
    './views/job_list_view',
    './views/job_creator_view'],
    function(
        _,
        TextPrizm,
        MachineCollection,
        MachineListView,
        JobCollection,
        JobListView,
        JobCreatorView) {

        /**
         * A collection of functions that control the dashboard
         */
        var DidiController = function() {

            this.machines = new MachineCollection();
            this.machines.fetch();

            this.jobs = new JobCollection();
            this.jobs.fetch();

        };

        _.extend(DidiController.prototype, {

            /**
             * Start the Didi monitor/controller
             */
            start: function() {
                //Create the interface
                this.showMachines(this.machines);
                this.showJobs(this.jobs);
                this.showJobCreator();
            },

            /**
             * Create and show the list of machines.
             */
            showMachines: function(machines) {
                var machinesListView = new MachineListView({
                    collection: machines
                });
                TextPrizm.machinesMonitor.show(machinesListView);
            },

            /**
             * Create and show the list of jobs.
             */
            showJobs: function(jobs) {
                var jobsListView = new JobListView({
                    model: jobs
                });
                TextPrizm.jobsMonitor.show(jobsListView);
            },

            /**
             * Create and show the job creator.
             */
            showJobCreator: function() {
                var jobCreatorView = new JobCreatorView();
                TextPrizm.jobCreator.show(jobCreatorView);
            }
        });
        return DidiController;

    });
