define(['jquery', 'underscore', 'backbone', 'marionette',
    'common/helpers/all',
    'text!common/templates/alert_box.html'],
    function($, _, Backbone, Marionette, Helpers, alertBoxTemplate) {

        var AlertBox = Marionette.ItemView.extend({
            template: alertBoxTemplate,
            className: 'hide',

            defaults: {
                displayInterval: 4000
            },

            initialize: function() {
                _.defaults(this.options, this.defaults);
                this.model = new Backbone.Model({
                    message: "",
                    classes: ""
                });
            },

            onRender: function() {
                var offset = (- this.$el.width() / 2) + 'px';
                this.$el.css({
                    'margin-left': offset
                });
            },

            setMessage: function(options, classes) {
                if (_.isString(options)) {
                    options = {
                        message: options
                    }
                }

                options = _.defaults(options, {
                    message: 'Alert!',
                    displayInterval: this.options.displayInterval,
                    returnTerminator: false
                });

                classes = classes || " ";

                this.model.set({
                    message: options.message,
                    classes: classes
                });

                this.render();

                this.$el.fadeIn('fast');

                var self = this;
                if (options.returnTerminator) {
                    return function() {
                        //Cancel, if still showing the same message
                        if (options.message === self.model.get('message')) {
                            self.$el.fadeOut('slow');
                        }
                    }
                } else {
                    setTimeout(function() {
                        self.$el.fadeOut('slow');
                    }, options.displayInterval);
                }
            }
        });

        return AlertBox;

    });