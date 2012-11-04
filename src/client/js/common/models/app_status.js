define(['backbone'], function(Backbone) {
    /**
     * Model for storing the app status.
     */
    var AppStatus = Backbone.Model.extend({
        url: '/'
    });
    return AppStatus;
});
