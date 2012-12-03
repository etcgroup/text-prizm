define(['backbone', '../models/task'], function(Backbone, Task) {

    var TaskCollection = Backbone.Collection.extend({
        url: 'didi/comp/tasks',
        model: Task
    });
    return TaskCollection;
});
