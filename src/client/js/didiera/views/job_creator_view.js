define(['marionette'],
    function(Marionette) {

        /**
         * A view that creates jobs.
         */
        var JobCreatorView = Marionette.ItemView.extend({
            template: "I'm a job creator"
        });

        return JobCreatorView;
    });