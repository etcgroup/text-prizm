define(['backbone'], function(Backbone) {
    /**
     * Model for storing information about the data set.
     */
    var DataSet = Backbone.Model.extend({
        url: '/'
    });
    return DataSet;
});
