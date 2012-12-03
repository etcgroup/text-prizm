define(['marionette',
    'common/helpers/all',
    'text!../templates/task_item.html'],
    function(Marionette, Helpers, taskItemTemplate) {

        /**
         * A view that summarizes a task.
         */
        var TaskItemView = Marionette.ItemView.extend({
            template: taskItemTemplate,
            tagName: 'li',
            className: 'task',
            templateHelpers: Helpers
        });

        return TaskItemView;
    });