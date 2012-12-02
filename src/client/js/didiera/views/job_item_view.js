define(['marionette'],
    function(Marionette) {

        /**
         * A view that summarizes a job.
         */
        var JobItemView = Marionette.ItemView.extend({
            template: "I'm a job",
            tagName: 'li',
            className: 'job'
        });

        return JobItemView;
    });