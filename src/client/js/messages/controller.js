define(['underscore',
    'textprizm',
    'common/collections/message_collection',
    './views/message_list_view',
    './models/cluster_selection',
    './views/cluster_selection_view'],
    function(
        _,
        TextPrizm,
        MessageCollection,
        MessageListView,
        ClusterSelection,
        ClusterSelectionView) {

        /**
         * A collection of functions that control the messages viewer
         */
        var MessagesController = function() {
            this.clusterSelection = new ClusterSelection();
            this.messages = new MessageCollection();
        };

        _.extend(MessagesController.prototype, {
            /**
             * Default route with no selection made yet
             */
            start: function() {
                //Create the interface
                this.initClusterSelection();
            },

            /**
             * Cluster was selected by ID.
             */
            startById: function(clusterId) {
                this.initClusterSelection({
                    cluster_id: clusterId
                });
            },

            /**
             * Cluster was selected by date
             */
            startByDate: function(startDate) {
                this.initClusterSelection({
                    start_date: unescape(startDate)
                });
            },

            initClusterSelection: function(options) {
                options = options || {};
                this.clusterSelection = new ClusterSelection(options);
                this.clusterSelection.on("change", this.clusterSelectionChange, this);
                this.showClusterSelection();

                this.showMessageListView();
                this.messages.fetchCluster(this.clusterSelection.toJSON());
            },

            /**
             * Render the cluster selector.
             */
            showClusterSelection: function() {
                var clusterSelectionView = new ClusterSelectionView({
                    model: this.clusterSelection
                });
                TextPrizm.messageNavigator.show(clusterSelectionView);
            },

            /**
             *Render the message list view.
             */
            showMessageListView: function() {
                var messageListView = new MessageListView({
                    collection: this.messages
                });
                TextPrizm.messageViewer.show(messageListView);
            },

            /**
             * Called when the cluster selection has been changed.
             */
            clusterSelectionChange: function(clusterSelection) {
                var urlHash = clusterSelection.getAddress();
                TextPrizm.router.navigate(urlHash);

                this.messages.fetchCluster(this.clusterSelection.toJSON());
            }
        });
        return MessagesController;

    });
