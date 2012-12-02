define(['backbone', 'lib/backbone-relational'], function(Backbone) {
    /**
     * Model for storing a task.
     */
    var Task = Backbone.RelationalModel.extend({
        url: 'didi/comp/task'
    });
    return Task;
});
