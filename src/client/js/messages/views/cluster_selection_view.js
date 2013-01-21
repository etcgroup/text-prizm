define(['marionette', 'moment', 'lib/bootstrap',
    'text!../templates/cluster_selection.html',
    'common/helpers/all'],
    function(Marionette, moment, bootstrap, clusterSelectionTemplate, Helpers) {

        /**
         * A view that lets you select a cluster.
         */
        var ClusterSelectionView = Marionette.ItemView.extend({
            template: clusterSelectionTemplate,
            templateHelpers: Helpers,

            ui: {
                startDateInput: "#start-date-input",
                clusterIdInput: "#cluster-id-input"
            },

            modelEvents: {
                'change': 'render'
            },

            events: {
                'click #go-button': "goClicked",
                'change #start-date-input': "startDateInputChanged",
                'change #cluster-id-input': "clusterIdInputChanged"
            },

            onRender: function() {
                this.ui.startDateInput.tooltip({
                    placement: 'bottom'
                });
            },

            startDateInputChanged: function() {
                this.ui.clusterIdInput.val('');
            },

            clusterIdInputChanged: function() {
                this.ui.startDateInput.val('');
            },

            goClicked: function() {

                var startDateText = this.ui.startDateInput.val();
                var clusterIdText = this.ui.clusterIdInput.val();
                if (startDateText) {
                    var startDate = moment.utc(startDateText, 'YYYY-MM-DD HH:mm:ss');
                    if (!startDate.isValid()) {
                        alert("Invalid date format");
                    } else {
                        this.model.setStartDate(startDate);
                    }
                } else if (clusterIdText) {
                    var clusterId = parseInt(clusterIdText);
                    if (isNaN(clusterId) || clusterId <= 0) {
                        alert("Invalid cluster id");
                    } else {
                        this.model.setClusterId(clusterId);
                    }
                } else {
                    alert("No selection made");
                }
            }
        });

        return ClusterSelectionView;
    });
