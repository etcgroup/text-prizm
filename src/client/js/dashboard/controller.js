define(['textprizm',
    './views/activity_list_view',
    './views/app_status_view',
    './views/data_summary_view'],
    function(
        TextPrizm,
        ActivityListView,
        AppStatusView,
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
        }

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
                var appStatusView = new AppStatusView();
                TextPrizm.appStatus.show(appStatusView);

                var dataSetSummaryView = new DataSummaryView();
                TextPrizm.dataSetSummary.show(dataSetSummaryView);
            }
        });
        return DashboardController;

    });
