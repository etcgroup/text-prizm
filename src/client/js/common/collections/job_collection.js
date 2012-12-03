define(['backbone', '../models/job'], function(Backbone, Job) {

    var JobCollection = Backbone.Collection.extend({
        url: 'didi/comp/jobs',
        model: Job
    });
    return JobCollection;
});
