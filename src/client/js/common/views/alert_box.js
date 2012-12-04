define(['backbone', 'marionette',
    'common/helpers/all',
    'text!common/templates/alert_box.html'],
    function(Backbone, Marionette, Helpers, alertBoxTemplate) {

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

            setMessage: function(message, classes) {
                classes = classes || " ";

                this.model.set({
                    message: message,
                    classes: classes
                });

                this.render();

                this.$el.fadeIn('fast');

                var self = this;
                setTimeout(function() {
                    self.$el.fadeOut('slow');
                }, this.options.displayInterval);
            }
        });

        return AlertBox;

    });