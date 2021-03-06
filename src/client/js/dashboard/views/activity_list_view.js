define(['marionette',
    '../views/activity_item_view',
    'text!../templates/activity_list.html'],
    function(Marionette, ActivityItemView, activityListTemplate) {

        /**
         * A view that is shown when there is not recent activity.
         */
        var EmptyActivityListView = Marionette.ItemView.extend({
            template: "No recent activity to display",
            tagName: 'li'
        });

        /**
         * A view that lists recent activity.
         */
        var ActivityListView = Marionette.CompositeView.extend({
            template: activityListTemplate,
            itemView: ActivityItemView,
            emptyView: EmptyActivityListView,
            itemViewContainer: 'ul'
        });

        return ActivityListView;
    });
