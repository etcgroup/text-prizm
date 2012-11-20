define(['underscore',
    'textprizm',
    'common/collections/activity_collection',
    './views/activity_list_view',
    'common/models/app_status',
    './views/app_status_view',
    'common/models/data_counts',
    './views/data_summary_view'],
    function(
        _,
        TextPrizm,
        ActivityCollection,
        ActivityListView,
        AppStatus,
        AppStatusView,
        DataCounts,
        DataSummaryView) {

        /**
         * A collection of functions that control the dashboard
         */
        var DashboardController = function() {

            this.activities = new ActivityCollection();
            this.activities.fetch();

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
