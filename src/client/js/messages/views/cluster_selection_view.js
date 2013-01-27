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
                displayField: ".display-field",
                inputField: ".input-field",
                selectionForm: ".selection-form",

                loadAllBox: '.load-all-box',
                showingCount: '.showing-count',
                totalCount: '.total-count',
                selectionType: '.selection-type',
                loadAllButton: '.load-all-button'
            },

            modelEvents: {
                'change': 'render'
            },

            events: {
                'click .display-field': 'editClicked',
                'click .go-button': "goClicked",
                'keyup .input-field': "inputKeyUp",
                'blur .input-field': "inputBlurred",
                'click .load-all-button': 'loadAllMessages'
            },

            initialize: function() {
                this.formShowing = false;
            },

            onBeforeRender: function() {
                this.closeTooltip();
            },

            closeTooltip: function() {
                if (this.tooltipPlaced) {
                    this.tooltipPlaced = false;
                    this.ui.inputField.tooltip('hide');
                    this.ui.inputField.off('.tooltip.data-api');
                }
            },

            onRender: function() {
                if (!this.model.hasSelection()) {
                    this.showForm();
                }
            },

            hideForm: function() {
                this.closeTooltip();
                this.ui.displayField[0].style.display = "inline-block";
                this.ui.selectionForm[0].style.display = "none";
                this.formShowing = false;
            },

            showForm: function() {
                this.ui.displayField[0].style.display = "none";
                this.ui.selectionForm[0].style.display = "inline";

                this.ui.inputField.tooltip({
                    placement: 'bottom'
                });
                this.tooltipPlaced = true;

                this.ui.inputField.val(this.ui.displayField.text());
                this.ui.inputField.focus();

                this.formShowing = true;
            },

            inputKeyUp: function(event) {
                //enter key
                if (event.which == 13) {
                    this.goClicked();
                }
            },

            inputBlurred: function() {
                this.hideForm();
            },

            editClicked: function() {
                if (this.formShowing) {
                    this.hideForm();
                } else {
                    this.showForm();
                }
            },

            goClicked: function() {
                var text = this.ui.inputField.val();

                var startDate = moment.utc(text, 'YYYY-MM-DD HH:mm:ss');
                if (startDate.isValid()) {
                    this.model.setStartDate(startDate);
                    this.hideForm();
                } else {
                    var clusterId = parseInt(text);
                    if (isNaN(clusterId) || clusterId <= 0) {
                        alert("Invalid cluster id");
                    } else {
                        this.model.setClusterId(clusterId);
                        this.hideForm();
                    }
                }
            },

            loadAllMessages: function() {
                this.model.trigger('load-all');
            },

            totalMessagesAvailable: function(count, messages) {
                this.updateShowingCount(messages.size());
                this.ui.totalCount.text(messages.getTotalMessageCount());
                this.ui.selectionType.text(messages.getSelectionType());

                this.ui.loadAllBox.slideDown();
            },

            onMessagesBatchAdd: function(options, messages) {
                this.updateShowingCount(messages.size());
            },

            onMessagesReset: function(messages) {
                this.updateShowingCount(messages.size());
            },

            updateShowingCount: function(count) {
                this.ui.showingCount.text(count);
            }
        });

        return ClusterSelectionView;
    });
