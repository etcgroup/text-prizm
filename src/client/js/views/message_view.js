define(['lib/jquery', 'lib/backbone-relational', 'lib/underscore', 'views/code_instance_view'],
    function($, Backbone, _, CodeInstanceView) {

        var MessageView = Backbone.View.extend({
            tagName: 'li',
            className: 'message-view',

            initialize: function(attributes) {
                this.model.view = this;
                this.listView = attributes.listView;
                this.listIndex = attributes.listIndex;
                this.model.on('change', this.render, this);
                this.model.on('add:instances remove:instances', this.renderInstances, this);
            },

            render: function() {
                this.$el.html(MessageView.template(this.model));
                this.renderInstances();

                this.$('.participantIndicator').css({
                    background: this.model.get('participant').get('color')
                })
                return this;
            },

            renderInstances: function() {
                var instanceViews = [];
                this.model.get('instances').each(function(instance) {
                    instanceViews.push((new CodeInstanceView({
                        model: instance
                    })).render().el);
                });
                this.$('.instances').html(instanceViews);
            }

        }, {
            template: _.template($('#message-template').html())
        });
        return MessageView;
    });