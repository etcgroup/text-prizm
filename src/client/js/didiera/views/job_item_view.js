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
            className: 'job',
            templateHelpers: Helpers,

            ui: {
                taskList: '.task-list',
                tasksToggleButton: '.tasks-toggle-button'
            },

            events: {
                'click .tasks-toggle-button': 'toggleTaskList'
            },

            initialize: function() {
                this.collection = this.model.get("task_list");
            },

            expandTaskList: function() {
                this.ui.taskList.show();
                this.ui.tasksToggleButton.text('Collapse');
                this.tasksShowing = true;
            },

            collapseTaskList: function() {
                this.ui.taskList.hide();
                this.ui.tasksToggleButton.text('Expand');
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