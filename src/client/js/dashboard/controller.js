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
            this.activities = new Backbone.Collection();
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
                //This is placeholder data
                var self = this;
                setTimeout(function() {
                    self.activities.add([{
                        name: 'foo'
                    },{
                        name: 'bar'
                    }]);
                }, 1000);

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
