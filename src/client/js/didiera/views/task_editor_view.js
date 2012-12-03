define(['marionette',
    'common/helpers/all',
    'text!../templates/task_editor.html'],
    function(Marionette, Helpers, taskEditorTemplate) {

        /**
         * A view that edits a task.
         */
        var TaskEditorView = Marionette.ItemView.extend({
            template: taskEditorTemplate,
            templateHelpers: Helpers,

            ui: {
                taskTypeInput: '#task-type-input',
                paramsInput: '#params-input',
                taskTypeAlert: '#task-type-alert',
                paramsAlert: '#params-alert',
                dataInput: '#data-input',
                dataAlert: '#data-alert'
            },

            events: {
                'click .done-button': 'saveTaskData'
            },

            validateInput: function() {
                var valid = true;

                if (Helpers.trim(this.ui.taskTypeInput.val()).length === 0) {
                    this.ui.taskTypeAlert
                    .text('Task Type must not be empty')
                    .slideDown();
                    valid = false;
                } else {
                    this.ui.taskTypeAlert.hide();
                }

                var paramsError = Helpers.get_json_error(this.ui.paramsInput.val());
                if (paramsError) {
                    this.ui.paramsAlert
                    .html('Params must be valid JSON: <i>' + paramsError + '</i>')
                    .slideDown();
                    valid = false;
                } else {
                    this.ui.paramsAlert.hide();
                }

                var dataError = Helpers.get_json_error(this.ui.dataInput.val());
                if (dataError) {
                    this.ui.dataAlert
                    .html('Data Spec must be valid JSON: <i>' + dataError + '</i>')
                    .slideDown();
                    valid = false;
                } else {
                    this.ui.dataAlert.hide();
                }

                return valid;
            },

            saveTaskData: function() {
                if (this.validateInput()) {
                    this.model.set({
                        task_type: this.ui.taskTypeInput.val(),
                        params_json: this.ui.paramsInput.val(),
                        data_json: this.ui.dataInput.val()
                    });
                    this.trigger('task-validated');
                    this.close();
                }
            }
        });

        return TaskEditorView;
    });