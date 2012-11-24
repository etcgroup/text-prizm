define(['backbone', '../models/activity'], function(Backbone, Activity) {

    var ActivityCollection = Backbone.Collection.extend({
        url: 'rest/activities/recent?limit=10',
        model: Activity
    });
    return ActivityCollection;
});
