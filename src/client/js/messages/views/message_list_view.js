define(['backbone', 'marionette',
    '../views/message_item_view',
    'text!../templates/message_list.html'],
    function(Backbone, Marionette, MessageItemView, messageListTemplate) {

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
            itemViewContainer: 'ul.message-list',
            className: 'message-list-view',

            ui: {
                messageList: 'ul.message-list',
                loadAllBox: '.load-all-box',
                showingCount: '.showing-count',
                totalCount: '.total-count',
                selectionType: '.selection-type',
                loadAllButton: '.load-all-button'
            },

            events: {
                'scroll': 'onScroll',
                'click .load-all-button': 'loadAllMessages'
            },

            collectionEvents: {
                'reset': 'updateShowingCount',
                'batch-add': 'renderMoreMessages',
                'total-messages': 'totalMessagesAvailable'
            },

            // Build an `itemView` for every model in the collection.
            buildItemView: function(item, ItemViewType, itemViewOptions){

                if (ItemViewType !== MessageItemView) {
                    return Marionette.CompositeView.prototype.buildItemView.apply(this, arguments);
                } else {
                    //group the code instances
                    var instancesByCodeId = item.get('instances').groupBy(function(instance) {
                        return instance.get('code').get('id');
                    });

                    var appliedCodes = new Backbone.Collection();
                    _.each(instancesByCodeId, function(instancesForCode) {
                        var codeModel = instancesForCode[0].get('code');
                        appliedCodes.add(new Backbone.Model({
                            code: codeModel,
                            instances: new Backbone.Collection(instancesForCode)
                        }));
                    });

                    var options = _.extend({
                        model: item,
                        collection: appliedCodes
                    }, itemViewOptions);
                    var view = new ItemViewType(options);
                    return view;
                }
            },

            totalMessagesAvailable: function(total) {
                this.updateShowingCount();
                this.ui.totalCount.text(this.collection.getTotalMessageCount());
                this.ui.selectionType.text(this.collection.getSelectionType());

                this.ui.loadAllBox.slideDown();
            },

            onScroll: function() {
                var totalHeight = this.ui.messageList.height();
                var scrollTop = this.$el.scrollTop() + this.$el.height();
                var margin = 200;

                if (scrollTop + margin >= totalHeight) {
                    this.collection.fetchMoreMessages();
                }
            },

            loadAllMessages: function() {
                this.collection.fetchAllMessages();
            },

            updateShowingCount: function() {
                this.ui.showingCount.text(this.collection.size());
            },

            renderMoreMessages: function(options) {
                var ItemView = this.getItemView();

                for (var i = options.from; i < options.to; i++) {
                    var item = this.collection.at(i);
                    this.addItemView(item, ItemView, i);
                }

                this.updateShowingCount();
            }
        });

        return MessageListView;
    });
