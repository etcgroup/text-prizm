define(['marionette', 'textprizm',
    'common/models/job',
    'common/models/task',
    'common/helpers/all',
    '../views/task_editor_view',
    '../views/task_item_view',
    'text!../templates/job_creator.html'],
    function(Marionette, TextPrizm, Job, Task, Helpers, TaskEditorView, TaskItemView, jobCreatorTemplate) {

        /**
         * A view that creates jobs.
         */
        var JobCreatorView = Marionette.CompositeView.extend({
            template: jobCreatorTemplate,
            itemView: TaskItemView,
            itemViewContainer: '.task-list',

            events: {
                'click .add-task-button': 'addNewTask',
                'click .submit-button': 'submit',
                'click .cancel-button': 'cancel'
            },

            ui: {
                taskList: '.task-list',
                taskListAlert: '.task-list-alert',
                descriptionInput: '#description-input',
                descriptionAlert: '#description-alert'
            },

            initialize: function() {
                //Create a blank job and get the task list for it
                this.model = new Job();
                this.collection = this.model.get("task_list");
            },

            /**
             * Add a new task to the job and open the editor.
             */
            addNewTask: function() {
                var task = new Task();
                var editor = new TaskEditorView({
                    model: task
                });

                var self = this;
                editor.on('task-validated', function() {
                    self.model.appendTask(task);
                });

                TextPrizm.modal.show(editor);
            },

            validateInput: function() {
                var valid = true;

                if (Helpers.trim(this.ui.descriptionInput.val()).length === 0) {
                    this.ui.descriptionAlert.text('Provide a description.').slideDown();
                    valid = false;
                } else {
                    this.ui.descriptionAlert.hide();
                }

                if (this.ui.taskList.find('.task').length === 0) {
                    this.ui.taskListAlert.text('You must add some tasks.').slideDown();
                    valid = false;
                } else {
                    this.ui.taskListAlert.hide();
                }

                return valid;
            },

            /**
             * Attempts to submit the job. If the job is saved,
             * the creator closes.
             */
            submit: function() {
                if (this.validateInput()) {
                    var self = this;
                    this.model.save({
                        description: this.ui.descriptionInput.val()
                    }, {
                        success: function(model, resp) {
                            self.close();
                            TextPrizm.success('Job submitted successfully');
                        },
                        error: function(model, resp) {
                            TextPrizm.error('Job not submitted!');
                        }
                    })
                }
            },

            /**
             * Closes the job creator without saving.
             */
            cancel: function() {
                this.close();
            }
        });

        return JobCreatorView;
    });