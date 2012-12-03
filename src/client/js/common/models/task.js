define(['backbone', 'lib/backbone-relational'], function(Backbone) {
    /**
     * Model for storing a task.
     */
    var Task = Backbone.RelationalModel.extend({
        url: 'didi/comp/task',
        defaults: {
            task_type: '',
            params_json: '',
            data_json: ''
        }
    });
    return Task;
});
