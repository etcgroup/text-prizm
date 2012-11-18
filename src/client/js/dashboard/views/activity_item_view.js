define(['jquery', 'marionette', 'underscore', 'backbone',
    'common/helpers/all',
    'common/models/activity',
    'text!../templates/activity_item.html',
    'text!../templates/activities.html'],
    function($, Marionette, _, Backbone,
        Helpers, Activity, activityItemTemplate, activitiesTemplates) {

        var activity_templates = {};

        activitiesTemplates = $(activitiesTemplates).children();
        activitiesTemplates.each(function(idx, element) {
            activity_templates[this.id] = _.template($(this).html());
        });

        /**
         * A view that summarizes an item of recent activity.
         */
        var ActivityItemView = Marionette.ItemView.extend({
            template: activityItemTemplate,
            templateHelpers: Helpers,
            tagName: 'li',
            className: 'activity',

            serializeData: function() {
                var data = this.model.toJSON();

                //Insert the correct activity template for this activity type
                data.activity_body = activity_templates[this.model.get('activity_type')];

                return data;
            }
        });

        return ActivityItemView;
    });
