define(['underscore',
    'textprizm',
    'common/collections/machine_collection',
    './views/machine_list_view',
    'common/collections/job_collection',
    './views/job_list_view',
    './views/job_creator_view',
    'common/models/machine',
    'common/models/job',
    'common/models/task'],
    function(
        _,
        TextPrizm,
        MachineCollection,
        MachineListView,
        JobCollection,
        JobListView,
        JobCreatorView,
        Machine, Job, Task) {

        /**
         * A collection of functions that control the dashboard
         */
        var DidiController = function() {

            this.machines = new MachineCollection();
            this.machines.add(new Machine());
            this.machines.add(new Machine());
            this.machines.add(new Machine());
            //this.machines.fetch();

            this.jobs = new JobCollection();
            this.jobs.add(new Job({
                id: 1,
                task_list: [ new Task(), new Task(), new Task() ],
                task_count: 3,
                progress: 2,
                added: 0,
                description: "three tasks",
                user: {
                    id: 1,
                    name: "testuser"
                }
            }));
            this.jobs.add(new Job({
                id: 2,
                task_list: [ new Task(), new Task() ],
                task_count: 2,
                progress: 0,
                added: 0,
                description: "two tasks",
                user: {
                    id: 2,
                    name: "testuser2"
                }
            }));
        //this.jobs.fetch();

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
                    collection: jobs
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
