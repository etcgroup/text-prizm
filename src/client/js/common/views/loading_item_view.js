define(['marionette', 'jquery',
    'lib/spin',
    'text!common/templates/spinner.html'],
    function(Marionette, $, Spinner, spinnerTemplate) {

        var LoadingItemView = Marionette.ItemView.extend({

            constructor: function() {
                Marionette.ItemView.prototype.constructor.apply(this, arguments);

                this.bindBackboneEntityTo(this.model, {
                    'change' : '_onModelChange'
                });

                this._modelLoaded = false;
            },

            /**
             * Override base getTemplate() so that a special loading
             * template is used when the model is in its raw state.
             */
            getTemplate: function() {
                if (this._modelLoaded) {
                    return Marionette.ItemView.prototype.getTemplate.call(this);
                } else {
                    return spinnerTemplate;
                }
            },

            /**
             * 'change' event handler. Calls onModelChange() if it is defined.
             * Extending views should not handler 'change' events directly, but
             * should instead implement the onModelChange() method.
             */
            _onModelChange: function() {
                this._modelLoaded = true;
                this.disableSpinner();

                if (this.onModelChange) {
                    this.onModelChange();
                }
            },

            /**
             * This render implementation disables and/or enables
             * the spinner before and after calls to the base render function.
             */
            render: function() {

                this.disableSpinner();

                Marionette.ItemView.prototype.render.call(this);

                if (!this._modelLoaded) {
                    this.enableSpinner();
                }

                return this;
            },

            /**
             * Enables the spinner.
             */
            enableSpinner: function() {
                this.spinner = this.spinner || new Spinner();

                if (!this.spinnerEnabled) {
                    var target = this.$el.find('.spinner-box');
                    if (target.length > 0) {
                        this.spinner.spin(target[0]);
                        $(this.spinner.el).css({
                            top: '50%',
                            left: '50%'
                        });

                        this.spinnerEnabled = true;
                    }
                }
            },

            /**
             * Stops the spinner if it has been enabled.
             */
            disableSpinner: function() {
                if (this.spinner) {
                    this.spinner.stop();
                }
                this.spinnerEnabled = false;
            }
        });

        return LoadingItemView;
    });