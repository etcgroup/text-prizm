define(['lib/jquery', 'lib/jqueryui', 'lib/backbone-relational', 'lib/underscore', 'views/message_view'],
    function($, jqueryUI, Backbone, _, MessageView) {

        var MessageListView = Backbone.View.extend({
            el: $('#message-list-view ul'),

            initialize: function() {
                this.selection = undefined;

                this.collection.on('reset', this.render, this);

                this.messageList = $('#message-list-view');

                var self = this;
                this.$el.selectable({
                    change: function(event, ui) {
                        self.selectionChanged(ui);
                    }
                });
            },
            takeFocus: function() {
                this.$el.focus();
            },
            enableKeyboardSelection: function(enabled) {
                this.$el.data('selectable').options.keyboard = enabled;
            },

            selectionChanged: function(selection) {
                window.controller.clearCodeFilter();

                this.selection = selection;
                var last = $(selection.currentFocus);

                var currentScroll = this.messageList.scrollTop();

                var lastTop = last.position().top;
                var lastBottom = lastTop + last.outerHeight();

                var height = this.messageList.innerHeight();
                if (lastTop < 0){
                    this.messageList.scrollTop(lastTop + currentScroll);
                } else if (lastBottom > height) {
                    this.messageList.scrollTop(lastBottom + currentScroll - height);
                }

                this.trigger("selectionChanged", selection);
            },

            advanceToNext: function() {
                this.$el.selectable("next");
            },

            render: function() {
                var self = this;

                this.$el.empty();

                this.collection.each(function(message, index) {
                    var view = new MessageView({
                        model: message,
                        listView: self,
                        listIndex: index
                    });
                    self.$el.append(view.render().el);
                });

                this.refreshSelection();
            },

            refreshSelection: function() {
                console.log("Selection refreshed");
                this.$el.selectable("refresh");
            }
        });

        return MessageListView;
    });