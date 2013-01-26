define(['underscore', 'backbone', 'lib/backbone-relational'], function(_, Backbone) {

    var highlightColors = {
        '#347DCE': false,
        '#9734CE': false,
        '#CE3434': false,
        '#0D9228': false
    };
    var finalColor = '#1FA096';

    var Code = Backbone.RelationalModel.extend({
        url: 'api/coding/code',

        initialize: function() {
            this.highlighted = false;
        },

        toggleHighlight: function() {
            if (this.highlighted) {
                highlightColors[this.highlighted] = false;
                this.highlighted = false;
            } else {
                var self = this;
                _.each(highlightColors, function(value, key) {
                    if (!value && !self.highlighted) {
                        self.highlighted = key;
                        highlightColors[key] = self;
                    }
                });

                if (!this.highlighted) {
                    this.highlighted = finalColor;
                }
            }

            this.trigger('toggle-highlight');
        }
    });
    return Code;
});
