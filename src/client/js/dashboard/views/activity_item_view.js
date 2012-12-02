define(['jquery', 'marionette', 'underscore',
    'common/helpers/all',
    'text!../templates/activity_item.html',
    'text!../templates/activities.html'],
    function($, Marionette, _,
        Helpers, activityItemTemplate, activitiesTemplates) {

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

            /**
             * Get the sub-template for the activity type.
             */
            getActivityTemplate: function() {
                return activity_templates[this.model.get('activity_type')];
            },

            serializeData: function() {
                var data = this.model.toJSON();

                //Insert the correct activity template for this activity type
                data.activity_body = this.getActivityTemplate();

                return data;
            }
        });

        return ActivityItemView;
    });
