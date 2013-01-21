define(['marionette',
    '../views/message_item_view',
    'text!../templates/message_list.html'],
    function(Marionette, MessageItemView, messageListTemplate) {

        /**
         * A view shown when no messages are loaded.
         */
        var EmptyMessageListView = Marionette.ItemView.extend({
            template: "No messages loaded",
            tagName: 'li'
        });

        /**
         * A view that lists messages.
         */
        var MessageListView = Marionette.CompositeView.extend({
            template: messageListTemplate,
            itemView: MessageItemView,
            emptyView: EmptyMessageListView,
            itemViewContainer: 'ul.message-list'
        });

        return MessageListView;
    });
