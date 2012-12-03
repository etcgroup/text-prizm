define(['marionette',
    '../views/job_item_view',
    'text!../templates/job_list.html'],
    function(Marionette, JobItemView, jobListTemplate) {
        /**
         * A view that is shown when there are no jobs.
         */
        var EmptyJobListView = Marionette.ItemView.extend({
            template: "No jobs.",
            tagName: 'li'
        });

        /**
         * A view that lists the current jobs.
         */
        var JobListView = Marionette.CompositeView.extend({
            template: jobListTemplate,
            itemView: JobItemView,
            itemViewContainer: 'ul',
            emptyView: EmptyJobListView,
            
            events: {
                'click .create-job-button': 'showJobCreator'
            },

            showJobCreator: function() {
                this.trigger('show-job-creator');
            }
        });

        return JobListView;
    });