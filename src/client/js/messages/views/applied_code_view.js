define(['marionette', 'underscore',
    'common/helpers/all',
    'text!../templates/applied_code.html'],
    function(Marionette, _,
        Helpers, appliedCodeTemplate) {

        /**
     * A view that displays an applied code.
     * It should be initialized with a main model (the code) and a collection (the instances).
     */
        var AppliedCodeView = Marionette.ItemView.extend({
            template: appliedCodeTemplate,
            templateHelpers: Helpers,
            tagName: 'li',
            className: 'applied-code',

            ui: {
                label: 'span'
            },

            events: {
                'click span' : 'codeClicked'
            },

            initialize: function() {
                this.model.get('code').on('toggle-highlight', this.render, this);
            },

            codeClicked: function() {
                this.model.get('code').toggleHighlight();
            },

            onBeforeRender: function() {
                if (this.tooltipPlaced) {
                    this.tooltipPlaced = false;
                    this.ui.label.tooltip('hide');
                    this.ui.label.off('.tooltip.data-api');
                }
            },

            serializeData: function() {
                //Apply default serialization
                var codeData = this.model.get('code').toJSON();
                var instanceData = this.model.get('instances').toJSON();

                //Note whether the code is highlighted.
                //This is not stored as an attribute on the
                //model because it is a display property.
                codeData.highlight = this.model.get('code').highlighted || false;

                //Reduce the instance data to just names for convenience in the view.
                var coders = _.map(instanceData, function(instance) {
                    return instance.user.full_name;
                });

                return {
                    code: codeData,
                    coders: coders
                }
            },

            onRender: function() {
                this.ui.label.tooltip({
                    placement: 'left'
                });

                this.tooltipPlaced = true;
            }
        });

        return AppliedCodeView;
    });
