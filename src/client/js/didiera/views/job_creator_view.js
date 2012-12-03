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
                'click .submit-button': 'submit'
            },

            ui: {
                taskList: '.task-list',
                taskListAlert: '.task-list-alert',
                descriptionInput: '#desciprion-input',
                descriptionAlert: '#description-alert'
            },

            initialize: function() {
                this.model = new Job();
                this.collection = this.model.get("task_list");
            },

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
                    this.ui.taskListAlert.hide();
                }

                if (this.ui.taskList.find('.task').length === 0) {
                    this.ui.taskListAlert.text('You must add some tasks.').slideDown();
                    valid = false;
                } else {
                    this.ui.taskListAlert.hide();
                }

                return valid;
            },

            submit: function() {
                if (this.validateInput()) {
                    var self = this;
                    this.model.save(null, {
                        success: function(model, resp) {
                            self.close();
                            alert('Job submitted successfully.');
                        },
                        error: function(model, resp) {
                            alert('Job not submitted!');
                        }
                    })
                }
            }
        });

        return JobCreatorView;
    });