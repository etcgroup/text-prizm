define(['lib/backbone-relational', 'models/task_model'], function(Backbone, Task) {

    var TaskCollection = Backbone.Collection.extend({
        model: Task
    });
    return TaskCollection;
});