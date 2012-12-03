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
                task_list: [ new Task({
                    id: 1,
                    task_type: "type 1"
                }), new Task({
                    id: 2,
                    task_type: "type 2"
                }), new Task({
                    id: 3,
                    task_type: "type 3"
                }) ],
                task_count: 3,
                progress: 2,
                added: 0,
                description: "three tasks",
                user: {
                    id: 1,
                    name: "testuser",
                    full_name: "Test User"
                }
            }));
            this.jobs.add(new Job({
                id: 2,
                task_list: [ new Task({
                    id: 4,
                    task_type: "type 1"
                }), new Task({
                    id: 5,
                    task_type: "type 1"
                }) ],
                task_count: 2,
                progress: 0,
                added: 0,
                description: "two tasks",
                user: {
                    id: 2,
                    name: "testuser2",
                    full_name: "Test User"
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
                jobsListView.on('show-job-creator', this.showJobCreator, this);

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
