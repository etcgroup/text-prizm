define(['lib/jquery', 'lib/backbone-relational', 'lib/underscore',
    'models/code_model'],
    function($, Backbone, _, Code) {
        var CodeFilterView = Backbone.View.extend({
            el: $('#code-filter-view'),

            template: _.template($('#code-filter-template').html()),

            initialize: function() {
                this.text = "";
                window.controller.on("filterChanged", this.updateText, this);
                window.controller.on("codeSelectedChanged", this.updateCode, this);
            },

            render: function() {
                this.$el.html(this.template());
                this.filterBox = this.$('.filter-box');
                this.codeBox = this.$('.code-box');
                return this;
            },

            updateText: function(text, codeSelected) {
                if (this.text.length == 0 && text.length > 0) {
                    //Position the box
                    var focus = window.controller.messageListView.selection.currentFocus;
                    var top = focus.position().top;
                    var totalHeight = window.controller.messageListView.messageList.height();
                    if (top < totalHeight / 3) {
                        this.$el.css({
                            top: "50%"
                        });
                    } else if (top < 2 * totalHeight / 3) {
                        this.$el.css({
                            top: "17%"
                        });
                    } else {
                        this.$el.css({
                            top: "50%"
                        });
                    }

                    this.$el.fadeIn(200);
                }

                this.text = text;
                this.filterBox.text(text);

                if (text.length == 0) {
                    this.$el.fadeOut(200);
                }
            },

            updateCode: function(codeSelected) {
                if (codeSelected instanceof Code) {
                    this.codeBox.text(codeSelected.get('name'));
                    this.codeBox.attr('title', codeSelected.get('description'));
                } else {
                    this.codeBox.text("?");
                    this.codeBox.attr('title', "Keep typing...");
                }
            }
        });
        return CodeFilterView;
    });