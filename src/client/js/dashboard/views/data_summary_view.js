define(['marionette', 'lib/spin',
    'text!../templates/data_summary.html',
    'common/helpers/all'],
    function(Marionette, Spinner, dataSummaryTemplate, Helpers) {

        /**
         * A view summarizing information about the data set.
         */
        var DatSetSummaryView = Marionette.ItemView.extend({
            template: dataSummaryTemplate,
            templateHelpers: Helpers,
            modelEvents: {
                'change': 'modelChanged'
            },

            modelChanged: function() {
                if (this.model.get('loaded')) {
                    this.disableSpinner();
                }

                this.render();
            },

            onRender: function(){
                if (!this.model.get('loaded')) {
                    this.enableSpinner();
                }
            },

            /**
             * Enables the spinner.
             */
            enableSpinner: function() {
                if (!this.spinner) {
                    this.spinner = new Spinner();
                }
                var target = $('<div class="spinner-box">');
                this.$el.find('.row-fluid').append(target);

                this.spinner.spin(target[0]);
                $(this.spinner.el).css({
                    top: '50%',
                    left: '50%'
                });
            },

            /**
             * Stops the spinner if it has been enabled.
             */
            disableSpinner: function() {
                if (this.spinner) {
                    this.spinner.stop();
                    this.$el.find('.spinner-box').remove();
                }
            }
        });

        return DatSetSummaryView;
    });
