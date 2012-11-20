define(['underscore', 'backbone',
    'textprizm',
    './views/activity_list_view',
    'common/models/app_status',
    './views/app_status_view',
    'common/models/data_counts',
    './views/data_summary_view'],
    function(
        _,
        Backbone,
        TextPrizm,
        ActivityListView,
        AppStatus,
        AppStatusView,
        DataCounts,
        DataSummaryView) {

        /**
         * A collection of functions that control the dashboard
         */
        var DashboardController = function() {
            //Initialize an empty activities collection
            //This is using test data for now
            this.activities = new Backbone.Collection([{
                user: new Backbone.Model({
                    name: 'alice',
                    full_name: 'Alice'
                }),
                time: 1352098002,
                type: 'apply-codes',
                data: {
                    messages: 523,
                    cluster: 172
                }
            }, {
                user: new Backbone.Model({
                    name: 'bob',
                    full_name: 'Bob'
                }),
                time: 1352079002,
                type: 'create-code',
                data: {
                    code: new Backbone.Model({
                        name: 'sleepiness',
                        description: 'A feeling of mild tiredness or exhaustion.'
                    })
                }
            }, {
                user: new Backbone.Model({
                    name: 'alice',
                    full_name: 'Alice'
                }),
                time: 1352029502,
                type: 'update-code',
                data: {
                    code: new Backbone.Model({
                        name: 'annoyance',
                        description: 'Irritation or whatever.'
                    })
                }
            }, {
                user: new Backbone.Model({
                    name: 'bob',
                    full_name: 'Bob'
                }),
                time: 1351902002,
                type: 'create-memo',
                data: {
                    memo: new Backbone.Model({
                        id: 23,
                        summary: 'This code should be redefined ',
                        target_type: 'code',
                        target: new Backbone.Model({
                            name: 'annoyance',
                            description: 'Irritation or whatever.'
                        })
                    })
                }
            }]);

            this.data_counts = new DataCounts();
            this.data_counts.fetch();

            this.app_status = new AppStatus();
            this.app_status.fetch();
        };

        _.extend(DashboardController.prototype, {

            /**
             * Start the Dashboard
             */
            start: function() {
                //Create the interface
                this.showActivities(this.activities);
                this.showWidgets();

            //Now fetch the data
            },

            /**
            * Create and show the activity list view.
            */
            showActivities: function(activities) {
                var activitiesView = new ActivityListView({
                    collection: activities
                });
                TextPrizm.activities.show(activitiesView);
            },

            /**
             * Create and show the other widgets
             */
            showWidgets: function() {
                var appStatusView = new AppStatusView({
                    model: this.app_status
                });
                TextPrizm.appStatus.show(appStatusView);

                var dataSetSummaryView = new DataSummaryView({
                    model: this.data_counts
                });
                TextPrizm.dataSetSummary.show(dataSetSummaryView);
            }
        });
        return DashboardController;

    });
