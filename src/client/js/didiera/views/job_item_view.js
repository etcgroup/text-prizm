define(['marionette',
    'common/helpers/all',
    'text!../templates/job_item.html'],
    function(Marionette, Helpers, jobItemTemplate) {

        /**
         * A view that summarizes a job.
         */
        var JobItemView = Marionette.ItemView.extend({
            template: jobItemTemplate,
            tagName: 'li',
            className: 'job',
            templateHelpers: Helpers
        });

        return JobItemView;
    });