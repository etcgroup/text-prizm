define(['marionette',
    'common/views/activity_item_view',
    'text!../templates/activity_list.html'],
    function(Marionette, ActivityItemView, activityListTemplate) {

        var EmptyActivityListView = Marionette.ItemView.extend({
            template: "No recent activity to display",
            tagName: 'li'
        });

        var ActivityListView = Marionette.CompositeView.extend({
            template: activityListTemplate,
            itemView: ActivityItemView,
            emptyView: EmptyActivityListView,
            itemViewContainer: 'ul'
        });

        return ActivityListView;
    });