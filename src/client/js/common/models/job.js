define(['backbone', 'models/user_model', './task', 'lib/backbone-relational'], function(Backbone, User, Task) {
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
        }, {
            type: Backbone.HasMany,
            key: 'task_list',
            relatedModel: Task
        }
        ]
    });
    return Job;
});
