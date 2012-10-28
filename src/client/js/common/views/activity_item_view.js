define(['marionette',
    'text!../templates/activity_item.html'],
    function(Marionette, activityItemTemplate) {
        var ActivityItemView = Marionette.ItemView.extend({
            template: activityItemTemplate,
            tagName: 'li'
        });

        return ActivityItemView;
    })