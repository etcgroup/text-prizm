define(['marionette',
    '../views/job_item_view'],
    function(Marionette, JobItemView) {
        /**
         * A view that lists the current jobs.
         */
        var JobListView = Marionette.CompositeView.extend({
            template: "I'm a job list <ul></ul>",
            itemView: JobItemView,
            itemViewContainer: 'ul'
        });

        return JobListView;
    });