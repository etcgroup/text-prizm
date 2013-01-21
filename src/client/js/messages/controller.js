define(['underscore',
    'textprizm',
    './models/cluster_selection',
    './views/cluster_selection_view'],
    function(
        _,
        TextPrizm,
        ClusterSelection,
        ClusterSelectionView) {

        /**
         * A collection of functions that control the messages viewer
         */
        var MessagesController = function() {
            this.clusterSelection = new ClusterSelection();
        };

        _.extend(MessagesController.prototype, {

            listenForSelectionChanges: function() {
                this.clusterSelection.on("change", this.clusterSelectionChange, this);
            },

            /**
             * Start the Dashboard
             */
            start: function() {
                //Create the interface
                this.showClusterSelection();
            },

            startById: function(clusterId) {
                this.clusterSelection = new ClusterSelection({
                    cluster_id: clusterId
                });
                this.showClusterSelection();
            },

            startByDate: function(startDate) {
                startDate = unescape(startDate);
                this.clusterSelection = new ClusterSelection({
                    start_date: startDate
                });
                this.showClusterSelection();
            },

            /**
             * Render the cluster selector.
             */
            showClusterSelection: function() {
                this.listenForSelectionChanges();
                var clusterSelectionView = new ClusterSelectionView({
                    model: this.clusterSelection
                });
                TextPrizm.messageNavigator.show(clusterSelectionView);
            },

            /**
             * Called when the cluster selection has been changed.
             */
            clusterSelectionChange: function(clusterSelection) {
                var urlHash = clusterSelection.getAddress();
                TextPrizm.router.navigate(urlHash);
            }
        });
        return MessagesController;

    });
