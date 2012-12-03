define(['marionette',
    '../views/job_item_view',
    'text!../templates/job_list.html'],
    function(Marionette, JobItemView, jobListTemplate) {
        /**
         * A view that lists the current jobs.
         */
        var JobListView = Marionette.CompositeView.extend({
            template: jobListTemplate,
            itemView: JobItemView,
            itemViewContainer: 'ul',

            events: {
                'click .create-job-button': 'showJobCreator'
            },

            showJobCreator: function() {
                this.trigger('show-job-creator');
            }
        });

        return JobListView;
    });