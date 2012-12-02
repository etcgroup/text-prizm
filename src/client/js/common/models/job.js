define(['backbone', 'models/user_model', 'lib/backbone-relational'], function(Backbone, User) {
    /**
     * Model for storing a job.
     */
    var Job = Backbone.RelationalModel.extend({
        url: 'didi/comp/job',
        relations: [
        {
            type: Backbone.HasOne,
            key: 'user',
            relatedModel: User
        }
        ]
    });
    return Job;
});
