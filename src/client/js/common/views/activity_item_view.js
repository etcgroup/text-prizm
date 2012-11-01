define(['marionette',
    'text!../templates/activity_item.html'],
    function(Marionette, activityItemTemplate) {
        /**
         * A view that summarizes an item of recent activity.
         */
        var ActivityItemView = Marionette.ItemView.extend({
            template: activityItemTemplate,
            tagName: 'li'
        });

        return ActivityItemView;
    })