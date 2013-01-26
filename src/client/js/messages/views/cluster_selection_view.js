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
            className: 'cluster-selection',

            ui: {
                startDateInput: ".start-date-input",
                clusterIdInput: ".cluster-id-input",
                selectionForm: ".selection-form",
                editButton: ".edit-button"
            },

            modelEvents: {
                'change': 'render'
            },

            events: {
                'click .edit-button': "editClicked",
                'click .go-button': "goClicked",
                'change .start-date-input': "startDateInputChanged",
                'change .cluster-id-input': "clusterIdInputChanged",
                'keyup .start-date-input': "inputKeyUp",
                'keyup .cluster-id-input': "inputKeyUp"
            },

            initialize: function() {
                this.formShowing = false;
            },

            onRender: function() {
                this.ui.startDateInput.tooltip({
                    placement: 'bottom'
                });

                if (!this.model.hasSelection()) {
                    this.showForm();
                }
            },

            hideForm: function() {
                this.ui.selectionForm[0].style.display = "none";
                this.formShowing = false;
            },

            showForm: function() {
                this.ui.selectionForm[0].style.display = "inline";
                this.formShowing = true;
            },

            inputKeyUp: function(event) {
                //enter key
                if (event.which == 13) {
                    this.goClicked();
                }
            },

            startDateInputChanged: function() {
                this.ui.clusterIdInput.val('');
            },

            clusterIdInputChanged: function() {
                this.ui.startDateInput.val('');
            },

            editClicked: function() {
                if (this.formShowing) {
                    this.hideForm();
                } else {
                    this.showForm();
                }
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
                        this.hideForm();
                    }
                } else if (clusterIdText) {
                    var clusterId = parseInt(clusterIdText);
                    if (isNaN(clusterId) || clusterId <= 0) {
                        alert("Invalid cluster id");
                    } else {
                        this.model.setClusterId(clusterId);
                        this.hideForm();
                    }
                } else {
                    alert("No selection made");
                }
            }
        });

        return ClusterSelectionView;
    });
