define(['marionette', 'underscore',
    'common/helpers/all',
    'text!../templates/message_item.html'],
    function(Marionette, _,
        Helpers, messageItemTemplate) {


        /**
         * A view that displays a single message.
         */
        var MessageItemView = Marionette.ItemView.extend({
            template: messageItemTemplate,
            templateHelpers: Helpers,
            tagName: 'li',
            className: 'message'
        });

        return MessageItemView;
    });
