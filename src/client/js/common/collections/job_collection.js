define(['backbone', '../models/job'], function(Backbone, Job) {

    var JobCollection = Backbone.Collection.extend({
        url: 'didi/info/jobs',
        model: Job
    });
    return JobCollection;
});
