define(['lib/jquery', 'lib/jqueryui', 'lib/backbone-relational', 'lib/underscore'], function($, jqueryUI, Backbone, _) {
    var GridSelectorView = Backbone.View.extend({
        el: $('#grid-selector-view'),

        template: _.template($('#grid-selector-template').html()),

        events: {
            'click .grid-spot.grid-active': 'gridSpotClicked',
            'mouseenter .grid-spot.grid-active': 'gridSpotEnter'
        },

        initialize: function() {
            if (typeof this.options.positions == 'undefined') {
                $.error('No positions specified for GridSelectorView');
            }

            this.rows = {};
            var minHPos = 5000000, maxHPos = -5000000;
            var minVPos = 5000000, maxVPos = -5000000;
            for (var i in this.options.positions) {
                var element = this.options.positions[i];
                var pos = element[0];
                if (pos.x < minHPos) minHPos = pos.x;
                if (pos.x > maxHPos) maxHPos = pos.x;
                if (pos.y < minVPos) minVPos = pos.y;
                if (pos.y > maxVPos) maxVPos = pos.y;

                if (!(pos.y in this.rows)) {
                    this.rows[pos.y] = {};
                }

                this.rows[pos.y][pos.x] = {
                    data: element[1],
                    label: element[2]
                };
            }
            this.minHorizontalPosition = minHPos;
            this.maxHorizontalPosition = maxHPos;
            this.minVerticalPosition = minVPos;
            this.maxVerticalPosition = maxVPos;

            if (typeof this.options.defaultX == 'undefined') {
                this.options.defaultX = this.minHorizontalPosition;
            }

            if (typeof this.options.defaultY == 'undefined') {
                this.options.defaultY = this.minVerticalPosition;
            }

            window.controller.on("gridKeyDown", this.keyDown, this);
        },

        keyDown: function(keyCode) {
            var xDelta = 0;
            var yDelta = 0;
            switch (keyCode) {
                case $.ui.keyCode.RIGHT:
                case 68: //D
                case 76: //L
                    xDelta = 1;
                    break;
                case $.ui.keyCode.LEFT:
                case 65: //A
                case 74: //J
                    xDelta = -1;
                    break;
                case $.ui.keyCode.UP:
                case 87: //W
                case 73: //I
                    yDelta = -1;
                    break;
                case $.ui.keyCode.DOWN:
                case 83: //S
                case 75: //K
                    yDelta = 1;
                    break;
            }
            if (xDelta != 0 || yDelta != 0) {
                this.moveGridSelection(xDelta, yDelta);
            }
        },

        moveGridSelection: function(xDelta, yDelta) {
            var pos = this.getNewPosition(this.selectedX, this.selectedY, xDelta, yDelta);
            this.activate(pos.x, pos.y);
        },

        getNewPosition: function(x, y, xDelta, yDelta) {
            while(true) {
                x += xDelta;
                y += yDelta;

                if (y in this.rows && x in this.rows[y]) {
                    //This is acceptable
                    break;
                }

                if (x + xDelta < this.minHorizontalPosition ||
                    x + xDelta > this.maxHorizontalPosition ||
                    y + yDelta < this.minVerticalPosition ||
                    y + yDelta > this.maxVerticalPosition) {
                    //Next pos is not valid
                    break;
                }
            }

            return {
                x: x,
                y: y
            };
        },

        render: function() {
            this.$el.html(this.template(this.options));
            this.grid = this.$('.grid');
            this.label = this.$('.label');
            this.initializeGrid();
        },

        gridSpotClicked: function(event) {
            var codes = this.getSelectedCodes();
            window.controller.applyCode(codes);
            window.controller.exitGridMode();
        },

        gridSpotEnter: function(event) {
            var entered = $(event.currentTarget);
            var x = entered.data('x');
            var y = entered.data('y');

            this.activate(x, y);
        },

        initializeGrid: function() {
            var numHorizontalPositions = 1 + this.maxHorizontalPosition - this.minHorizontalPosition;
            var numVerticalPositions = 1 + this.maxVerticalPosition - this.minVerticalPosition;

            this.rowElements = {};
            for (var r = this.minVerticalPosition; r <= this.maxVerticalPosition; r++) {
                this.rowElements[r] = {};
                var rowElement = $('<div class="grid-row"></div>');

                for (var c = this.minHorizontalPosition; c <= this.maxHorizontalPosition; c++) {
                    var gridclass = "grid-spot clearfix";
                    var extra = '';
                    if (r in this.rows && c in this.rows[r]) {
                        gridclass += " grid-active";
                        extra += ' title="' + this.rows[r][c].label + '"';
                    }

                    var gridspot = $('<div ' + extra + ' >&nbsp;</div>');
                    gridspot.addClass(gridclass);
                    gridspot.data('x', c);
                    gridspot.data('y', r);

                    rowElement.append(gridspot);
                    this.rowElements[r][c] = gridspot;
                }

                this.grid.append(rowElement);
            }

            var width = this.$el.width();
            var height = this.$el.width();
            this.$el.css({
                width: width,
                'margin-left': -width / 2,
                'margin-top': -height /2
            });
        },

        activate: function(x, y) {
            if (y in this.rows && x in this.rows[y]) {
                //Deactivate the old one
                this.$('.grid-selected').removeClass('grid-selected');

                //Activate the new one
                this.rowElements[y][x].addClass('grid-selected');
                this.selectedX = x;
                this.selectedY = y;

                //Set the label
                this.label.html(this.rows[y][x].label);
            } else {
                var selected = this.rowElements[this.selectedY][this.selectedX];
                var currentBkg = selected.css('background-color');
                selected.animate({
                    backgroundColor: "#883AB4"
                }, 50).animate({
                    backgroundColor: currentBkg
                }, 150, function() {
                    selected.css({
                        'background-color': ''
                    });
                });
            }
        },

        getSelectedCodes: function() {
            var codeStrings = this.rows[this.selectedY][this.selectedX].data;
            var codes = [];
            for (var i in codeStrings) {
                var currentCode = window.controller.codeCollection.where({
                    name: codeStrings[i]
                });
                codes.push(currentCode[0]);
            }
            return codes;
        },

        showBox: function() {
            this.activate(this.options.defaultX, this.options.defaultY);

            //Position the box
            var top = 0;
            if (typeof window.controller.messageListView.selection != 'undefined') {
                var focus = window.controller.messageListView.selection.currentFocus;
                top = focus.position().top;
            }

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
        },

        hideBox: function() {
            this.$el.fadeOut(200);
        }
    });

    return GridSelectorView;
});