define(['backbone'], function(Backbone) {
    /**
     * Model for storing activities.
     */
    var Activity = Backbone.Model.extend({
        url: '/'
    });
    return Activity;
});
