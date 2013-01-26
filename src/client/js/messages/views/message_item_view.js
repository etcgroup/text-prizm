define(['marionette', 'underscore',
    'common/helpers/all',
    '../views/applied_code_view',
    'text!../templates/message_item.html'],
    function(Marionette, _,
        Helpers, AppliedCodeView, messageItemTemplate) {

        /**
         * A view that displays a single message.
         */
        var MessageItemView = Marionette.CompositeView.extend({
            template: messageItemTemplate,
            templateHelpers: Helpers,

            itemView: AppliedCodeView,
            itemViewContainer: 'ul.instances',

            tagName: 'li',
            className: 'message-item',

            ui: {
                timeLink: '.time-link',
                appliedCodes: '.applied-code'
            },

            onRender: function() {
                this.ui.timeLink.tooltip({
                    placement: 'right'
                });
            }
        });

        return MessageItemView;
    });
