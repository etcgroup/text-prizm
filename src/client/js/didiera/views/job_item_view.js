define(['marionette',
    'common/helpers/all',
    '../views/task_item_view',
    'text!../templates/job_item.html'],
    function(Marionette, Helpers, TaskItemView, jobItemTemplate) {

        /**
         * A view that summarizes a job.
         */
        var JobItemView = Marionette.CompositeView.extend({
            template: jobItemTemplate,
            itemView: TaskItemView,
            itemViewContainer: '.task-list',
            tagName: 'li',
            className: 'job clearfix',
            templateHelpers: Helpers,

            ui: {
                taskList: '.task-list'
            },

            events: {
                'click': 'toggleTaskList'
            },

            initialize: function() {
                this.collection = this.model.get("task_list");
            },

            expandTaskList: function() {
                this.ui.taskList.show();
                this.tasksShowing = true;
            },

            collapseTaskList: function() {
                this.ui.taskList.hide();
                this.tasksShowing = false;
            },

            toggleTaskList: function() {
                if (this.tasksShowing) {
                    this.collapseTaskList();
                } else {
                    this.expandTaskList();
                }
            }
        });

        return JobItemView;
    });