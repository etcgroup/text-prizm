define(function(require) {
    var $ = require('lib/jquery');
    require('lib/jqueryui');
    require('lib/jquery.blockUI');
    require('util/jquery.ui.selectable');
    var Backbone = require('lib/backbone-relational'),
    _ = require('lib/underscore'),
    MessageCollection = require('collections/message_collection'),
    CodeInstanceCollection = require('collections/code_instance_collection'),
    ParticipantCollection = require('collections/participant_collection'),
    CodeCollection = require('collections/code_collection'),
    UserCollection = require('collections/user_collection'),
    CodeInstance = require('models/code_instance_model'),
    Code = require('models/code_model'),
    RainbowGridView = require('views/rainbow_grid_view'),
    MessageListView = require('views/message_list_view'),
    CodeListView = require('views/code_list_view'),
    FrequencyView = require('views/frequency_view'),
    CodeFilterView = require('views/code_filter_view'),
    GridSelectorView = require('views/grid_selector_view'),
    GeneralInfoView = require('views/general_info_view');

    var CodingController = Backbone.Router.extend({
        initialize: function(options) {
            this.messageCollection = new MessageCollection();
            this.instanceCollection = new CodeInstanceCollection();
            this.participantCollection = new ParticipantCollection();
            this.codeCollection = new CodeCollection();
            this.userCollection = new UserCollection();
            this.codeSelectors = [];

            window.controller = this;

            this.messageCollection.on('reset', this.participantCollection.assignColors, this.participantCollection);

            var self = this;
            $(window).resize(function() {
                self.resizeViews();
            });

            $('#contentcolumn').on('keydown', function(event) {
                self.keyDown(event);
            });

            this.version = options.version;
            this.schemaId = options.schemaId;
            this.codeCollection.reset(options.codes);
            this.participantCollection.reset(options.participants);
            this.userCollection.reset(options.users);
            this.currentUser = this.userCollection.get(options.userId);

            this.messageListView = new MessageListView({
                collection: this.messageCollection
            });

            this.frequencyView = new FrequencyView({
                collection: this.messageCollection
            });

            this.codeFilterView = new CodeFilterView();
            this.codeFilterView.render();

            this.gridSelector = new GridSelectorView({
                title: 'Intensity and Valence',
                positions: [
                [{
                    x: -1,
                    y: 0
                }, ["n", "h"], "negative, high"],
                [{
                    x: -1,
                    y: 1
                }, ["n", "l"], "negative, low"],
                [{
                    x: 0,
                    y: 1
                }, ["o"], "neutral"],
                [{
                    x: 1,
                    y: 1
                }, ["p", "l"], "positive, low"],
                [{
                    x: 1,
                    y: 0
                }, ["p", "h"], "positive, high"],
                ],
                defaultX: 0,
                defaultY: 1
            });
            this.gridSelector.render();

            this.rainbowGridView = new RainbowGridView({
                el: $("#rbgrid")
            });

            this.codeListView = new CodeListView({
                el: $("#codeListView")
            });
            this.codeListView.render();

            this.generalInfoView = new GeneralInfoView({
                el: $("#general-info")
            });

            //                this.codeSelectors.push(this.rainbowGridView);
            this.addCodeSelector(this.codeListView);

            Backbone.history.start();
        },

        //        events: {
        //            'keydown #message-list-view': 'keyDown'
        //        },

        addCodeSelector: function(selector) {
            this.codeSelectors.push(selector);
            selector.on('codeClicked', this.applyCode, this);
        },

        routes: {
            ":from/:to": "loadData"
        },

        resizeViews: function() {
            $('#outer').height($('body').height() - $('#general-info').outerHeight())
        },

        loadData: function(from, to) {
            from = decodeURI(from);
            to = decodeURI(to);

            var self = this;

            if (this.from != from || this.to != to) {
                this.from = from;
                this.to = to;

                //Actually load new data
                var options = {
                    time_from: from,
                    time_to: to,
                    order_by: "time,id"
                }

                var message = "<h2>Welcome " + this.currentUser.get("full_name") + "!</h2>";
                message += "<h2 id='loading-messages'>Loading <i>messages</i>...</h2>"
                $.blockUI({
                    message: message,
                    css: {
                        border: '3px solid #a00'
                    }
                });

                this.messageCollection.fetch({
                    data: options,
                    success: function() {
                        console.log("Messages fetched successfully");

                        $('#loading-messages').addClass('faded').after("<h2>Loading <i>code instances</i>...</h2>");

                        options.schema_id = self.schemaId;
                        if (typeof window.get_all_users === "undefined") {
                            options.user_id = self.currentUser.get('id');
                        }
                        delete options.order_by;

                        self.instanceCollection.fetch({
                            data: options,
                            success: function() {
                                console.log("Instances fetched successfully");
                                $.unblockUI();
                            },
                            error: function() {
                                console.log("Instances not fetched");
                                $.unblockUI();
                            }
                        });
                    },
                    error: function() {
                        console.log("Messages not fetched");
                        $.unblockUI();
                    }
                });



            }
        },

        keyDown: function(event) {
            //Ignore special keys (not shift, we want those)
            if (event.altKey || event.ctrlKey || event.metaKey) {
                return;
            }

            switch(event.which) {
                case $.ui.keyCode.ESCAPE:
                    event.preventDefault();
                    this.clearCodeFilter();
                    break;
                case $.ui.keyCode.ENTER: //enter
                    event.preventDefault()
                    if (this.selectCode(event.shiftKey ? 1 : 0)) {
                        this.messageListView.advanceToNext();
                    }
                    break;
                case $.ui.keyCode.SPACE:
                    event.preventDefault();
                    this.selectCode(event.shiftKey ? 1 : 0);
                    break;
                case 220: //backslash
                    this.enterGridMode();
                    event.preventDefault();
                    break;
                default:
                    //If in grid mode, just forward the event
                    if (this.gridMode == true) {
                        event.preventDefault();
                        this.trigger('gridKeyDown', event.which);
                    }
                    //allow backspace and alphanumeric
                    else if (event.which == $.ui.keyCode.BACKSPACE ||
                        event.which == $.ui.keyCode.DELETE ||
                        (event.which >= 48 && event.which <= 90)) {
                        event.preventDefault();
                        this.changeCodeFilter(event.which);
                    }
                    break;

            }
        },

        enterGridMode: function() {
            this.clearCodeFilter();
            this.gridMode = true;
            this.messageListView.enableKeyboardSelection(false);
            this.gridSelector.showBox();
        },

        exitGridMode: function() {
            this.gridMode = false;
            this.messageListView.enableKeyboardSelection(true);
            this.gridSelector.hideBox();
            this.messageListView.takeFocus();
        },

        changeCodeFilter: function(keyCode) {
            if (!this.codeFilter) {
                this.codeFilter = "";
            }
            var isBackspace = keyCode == $.ui.keyCode.BACKSPACE || keyCode == $.ui.keyCode.DELETE;

            if (isBackspace && this.codeFilter.length > 0) {
                this.codeFilter = this.codeFilter.slice(0, -1);
                this.onCodeFilterChanged(this.codeFilter);
            } else if (!isBackspace) {
                this.codeFilter += String.fromCharCode(keyCode).toLowerCase();
                this.onCodeFilterChanged(this.codeFilter);
            } else {
            //No update
            }
        },

        clearCodeFilter: function() {
            if (this.gridMode == true) {
                this.exitGridMode();
            } else if (this.codeFilter && this.codeFilter.length > 0) {
                this.codeFilter = "";
                this.onCodeFilterChanged(this.codeFilter);
                this.messageListView.takeFocus();
            }
        },

        selectCode: function(flagged) {
            if (this.gridMode) {
                if (this.onCodeSelected(undefined, flagged)) {
                    this.exitGridMode();
                    return true;
                }
            } else if (this.codeFilter && this.codeFilter.length > 0) {
                //Regular code selection mode
                if (this.onCodeSelected(undefined, flagged)) {
                    this.codeFilter = "";
                    this.onCodeFilterChanged(this.codeFilter);
                    this.messageListView.takeFocus();
                    return true;
                }
            }
            return false;
        },

        onCodeFilterChanged: function(filterString) {
            this.trigger("filterChanged", filterString);

            var codeSelected = this.getSelectedCode();
            var codeName = "[nothing]";
            if (codeSelected instanceof Code) {
                codeName = codeSelected.get('name');
            }

            this.trigger('codeSelectedChanged', codeSelected);

            console.log("Filter Changed: " + filterString + " selecting " + codeName);
        },

        getSelectedCode: function() {
            if (this.gridMode == true) {
                //Grid selection mode
                var codes = this.gridSelector.getSelectedCodes();
                return codes;
            } else {
                var codeSelected = null;
                for (var i = 0; i < this.codeSelectors.length; i++) {
                    var selector = this.codeSelectors[i];
                    var code = selector.getCurrentCode();
                    if (code instanceof Code) {
                        codeSelected = code;
                        break;
                    }
                };
                return codeSelected;
            }
        },

        onCodeSelected: function(codeSelected, flagged) {
            if (codeSelected === undefined) {
                codeSelected = this.getSelectedCode();
            }

            if (codeSelected) {
                this.applyCode(codeSelected, flagged);
                this.trigger("codeSelected");
                console.log("Code selected");
                return true;
            }
            return false;
        },

        applyCode: function(codes, flagged) {
            var self = this;

            if (!(codes instanceof Array)) {
                codes = [codes];
            }

            _.each(this.messageListView.selection.selection, function(element) {
                var message_id = $(element).children('div').data('message_id');

                for (var i in codes) {
                    var code = codes[i];

                    var codeInstance = new CodeInstance({
                        code_id: code.get('id'),
                        message_id: message_id,
                        user_id: self.currentUser.get("id"),
                        flag: flagged
                    });

                    codeInstance.save({}, {
                        success: function() {
                            self.instanceCollection.add(codeInstance);
                            console.log("Code applied");
                        },
                        error: function() {
                            codeInstance.destroy();
                            console.log("Code could not be applied");
                            alert("Error sending code to server. Try the following:\n1. Check your internet connection\n2. Reload the page\n3. Check your browser's error console (take a screenshot)");
                        }
                    });
                }
            });
        }

    });
    return CodingController;
});