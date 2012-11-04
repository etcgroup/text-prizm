define(['backbone'], function(Backbone) {
    /**
     * Model for storing counts info about the data set.
     */
    var DataCounts = Backbone.Model.extend({
        url: '/ext/datacounts'
    });
    return DataCounts;
});
