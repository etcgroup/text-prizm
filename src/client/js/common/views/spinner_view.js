define(['marionette',
    'jquery',
    'lib/spin',
    'text!common/templates/spinner.html'],
    function(Marionette, $, Spinner, spinnerTemplate) {

        var SpinnerView = Marionette.ItemView.extend({
            template: spinnerTemplate,

            onRender: function() {
                this.spinner = this.spinner || new Spinner();

                var target = this.$el.find('.spinner-box');
                if (target.length > 0) {
                    this.spinner.spin(target[0]);
                    $(this.spinner.el).css({
                        top: '50%',
                        left: '50%'
                    });

                    this.spinnerEnabled = true;
                }
            },

            close: function() {
                if (this.spinner) {
                    this.spinner.stop();
                }

                Marionette.ItemView.prototype.close.call(this);
            },

            initialize: function() {
                if (typeof this.message !== 'undefined') {
                    this.model.set('message', this.message);
                }
            }
        });

        return SpinnerView;

    });