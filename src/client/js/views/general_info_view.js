define(function(require) {
    var $ = require('jquery'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    Date = require('lib/date'),
    Code = require('models/code_model');

    var GeneralInfoView = Backbone.View.extend({

        template: _.template($('#general-info-template').html()),

        events: {
            "click #create-code-button": "createCode",
            "keypress #codeEntryBox": "keyPressed",
            "click #fix-selection-button": "fixSelection",
            "click #copy-paste-button": "toggleCopyPaste"
        },

        initialize: function(attributes) {
            this.selectionDisabled = true;
            window.controller.messageCollection.on('reset', this.render, this);
            window.controller.messageCollection.on('change', this.updateProgress, this);
            window.controller.instanceCollection.on('reset change add remove', this.updateProgress, this);
            this.$el.addClass('clearfix');
        },

        render: function() {
            var from = Date.parse(window.controller.from);
            var to = Date.parse(window.controller.to);
            var hours = (to - from)/(60*60*1000); //in hours
            hours = hours.toPrecision(2) + " hours";

            var data = {
                from_time: from.toString('h:mm:ss tt, MMMM dS, yyyy'),
                time_interval: hours,
                message_count: window.controller.messageCollection.length,
                version: window.controller.version,
                user_name: window.controller.currentUser.get('name'),
                schema_id: window.controller.schemaId
            };

            this.$el.html(this.template(data));

            this.updateProgress();

            window.controller.resizeViews();

            return this;
        },

        keyPressed: function(event) {
            if (event.which == $.ui.keyCode.ENTER) {
                this.createCode();
            }
        },

        createCode: function() {
            var codeName = this.$('#codeEntryBox').val();
            codeName = $.trim(codeName);
            codeName = codeName.toLowerCase();

            if (codeName.length == 0) {
                return;
            }

            var codeExists = window.controller.codeCollection.any(function(codeItem) {
                return codeItem.get('name') == codeName;
            });
            if (codeExists) {
                this.$('#codeEntryBox').stop().css("background-color", "#fff")
                .animate({
                    backgroundColor: "#ffff66"
                }, 200).animate({
                    backgroundColor: "#fff"
                }, 200);
                console.log("Code exists");
                return;
            }

            var code = new Code({
                name: codeName,
                schema_id: window.controller.schemaId,
                description: ""
            });
            code.save({}, {
                success: function() {
                    window.controller.codeCollection.add(code);
                    this.$('#codeEntryBox').val('').stop().css("background-color", "#fff")
                    .animate({
                        backgroundColor: "#9f9"
                    }, 200).animate({
                        backgroundColor: "#fff"
                    }, 200);
                    console.log("Code " + codeName + " created");
                },
                error: function() {
                    this.$('#codeEntryBox').stop().css("background-color", "#fff")
                    .animate({
                        backgroundColor: "#f99"
                    }, 200).animate({
                        backgroundColor: "#fff"
                    }, 200);
                    console.log("Error creating code");
                }
            });
        },

        fixSelection: function() {
            window.controller.messageListView.refreshSelection();
        },

        toggleCopyPaste: function() {
            if (this.selectionDisabled) {
                window.controller.messageListView.disableSelection();
                this.$el.find('#copy-paste-button').text('Return to Normal');
                this.selectionDisabled = false;
            } else {
                window.controller.messageListView.enableSelection();
                this.$el.find('#copy-paste-button').text('Enable Copy Paste');
                this.selectionDisabled = true;
            }
        },

        updateProgress: function() {


            var codedLines = 0;
            window.controller.messageCollection.each(function(msg, index){
                codedLines += (msg.get('instances').length > 0) ? 1 : 0;
            });

            var percent = Math.round((codedLines * 100) / window.controller.messageCollection.length);

            //console.log('codedLines: ' + codedLines );
            //console.log('totalMessages: ' + window.controller.messageCollection.length );
            //console.log('updateProgress: ' + percent );;

            $('#coding-progress-bar-inner').css('width', percent.toString() + '%' );
        }

    });

    return GeneralInfoView;
});