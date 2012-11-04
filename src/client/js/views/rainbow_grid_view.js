define(['jquery', 'underscore', 'backbone', 'lib/color'],
    function($, _, Backbone, Color) {

        var RainbowGridView = Backbone.View.extend({
            defaults: {
                kbdSelectionState: 0,
                kbdSelectedRow: -1,
                isMouseHover: false,
                mouseHoverElem: null,
                doSpotlight: false,
                onSelected: null,
                transitionAnimLength: 250,
                quickTransitionLength: 25,
                numberSelectEnabled: false,
                bkgColor: new Color("#fff"),
                cellColor: function( bkgCol, rowCol, rowIdx, cellIdx ) {
                    switch(cellIdx) {
                        case 0:
                            return rowCol.lightenByRatio(1).blend(new Color('#fff'),0.75);
                        case 1:
                            return rowCol.blend(new Color('#fff'),0.35);
                        case 2:
                            return rowCol.saturateByRatio(1).darkenByRatio(0.25);
                        default:
                            return new Color('#F0F');
                    }
                },
                numRows: 8,
                numCols: 3,
                gridData: [
                {
                    color: new Color("#E00"),
                    labels: ["annoyance","anger","rage"]
                },
                {
                    color: new Color("#F80"),
                    labels: ["interest","anticipation","vigilance"]
                },
                {
                    color: new Color("#FD0"),
                    labels: ["serenity","joy","ecstasy"]
                },
                {
                    color: new Color("#9F0"),
                    labels: ["acceptance","trust","admiration"]
                },
                {
                    color: new Color("#0C4"),
                    labels: ["apprehension","fear","terror"]
                },
                {
                    color: new Color("#0DF"),
                    labels: ["distraction","surprise","amazement"]
                },
                {
                    color: new Color("#06F"),
                    labels: ["pensiveness","sadness","grief"]
                },
                {
                    color: new Color("#80F"),
                    labels: ["boredom","disgust","loathing"]
                }
                ]
            },

            //id: "rbgrid",

            events: {
                "click td": "codeSelect",
                "hover td": "hilightCode",
                "mouseenter table": "mouseEnter",
                "mouseleave table": "mouseOut",
                "filterByName" : "filterByName",
                "all" : "dbg"
            },

            render: function() {
                var cellColor = this.options.cellColor;
                var bkgColor = this.options.bkgColor;
                var gridData = this.options.gridData;

                var items = "<table><tbody>";
                _.each(gridData, function( a, i) {
                    var rowColor = a.color;
                    items += "<tr>";
                    items += "<th>" + (i+1) + "</th>";
                    _.each(a.labels, function( b, i2) {
                        var codeItem = window.controller.codeCollection.find(function(code,index) {
                            return code.get('name').toLowerCase() === b.toLowerCase();
                        });
                        var id = +codeItem.get('id'),
                        descr = codeItem.get('description');

                        items += "<td codeId=\"" + id + "\" " +
                        (descr.length > 0 ? ("title=\"" + descr + "\" ") : "") +
                        "style=\"background-color: " +
                        cellColor(bkgColor, rowColor, i, i2).toCSS() +
                        "\"><span>" + b + "</span>" +
                        "<kl>" + (i2+1) + "</kl></td>";
                    });
                    items += "</tr>";
                });
                items += "</tbody></table>";
                this.$el.html(items);

                // set row ids
                $('tr',this.el).each(function(rowIdx, rowEl) {
                    $(rowEl).attr('rowIdx', rowIdx + 1);
                    $(rowEl).attr('rowLabel', gridData[rowIdx].labels[1]);
                });

                // hilight key labels
                this.hilightKeyLabels();
            },

            codeSelect: function(a,b) {
                var elem = a.target.nodeName === "TD" ? a.target :  $(a.target).parent('td');
                console.dir(a.target);
                console.log('clicked elem: ' + elem.nodeName );
                console.dir($(elem).data());
                var y = $(elem).data('rowIdx');
                var x = $(elem).data('colIdx');
                this.onSelected(+y+1, +x+1, elem);
            },

            hilightCode: function(ev,b,c) {
                //console.log('hilight');
                //console.dir(a);
                this.mouseHoverElem = ev.target;

                if(this.options.doSpotlight) {
                    var focusX = $(ev.target).data('colIdx'),
                    focusY = $(ev.target).data('rowIdx');
                    $('td', this.el).each( function(idx,elem) {
                        var y = $(elem).data('rowIdx'),
                        x = $(elem).data('colIdx'),
                        dist = 1 / (Math.sqrt( Math.pow(x-focusX,2) + Math.pow(y-focusY,2))+ 1);
                        if(dist < 0.25) {
                            dist = 0;
                        }
                        //dist = Math.max(0.10, Math.min(dist,1));
                        //console.log('(x: ' + x + ', y: ' + y + ', d: ' + dist );
                        $('span',elem).fadeTo(25,dist);
                    });
                }
            },

            forEachCell: function(iterator) {
                $('tr',this.el).each(function(rowIdx, rowEl) {
                    $('td',rowEl).each(function(colIdx, colEl){
                        iterator(rowIdx, rowEl, colIdx, colEl);
                    });
                });
            },

            mouseEnter: function(ev) {
                //console.log('mouseEnter');
                //console.dir(ev.target);
                if(this.options.doSpotlight === false) {
                    $('span').fadeTo(this.options.transitionAnimLength, 1);
                }
                this.showRowKbdHints(false);
                this.resetKbdSelection(false);
                this.isMouseHover = true;

            },

            mouseOut: function(ev) {
                this.hilightKeyLabels();
                this.isMouseHover = false;
                this.mouseHoverElem = null;
                if(this.filterText != '') {
                    this.filterByName(this.filterText);
                }
            },

            hilightRow: function(rowNum) {
                $('tr',this.el).each((function(rowIdx, rowEl){
                    var op = (rowNum == rowIdx ? 1 : 0);
                    $('span',rowEl).fadeTo(this.options.transitionAnimLength, op);
                    $('kl',rowEl).removeClass( (op === 1 ? 'off' : 'on')).addClass((op === 1 ? 'on' : 'off'));
                }).bind(this));
            },

            cellOpacityFilter: function( filter ) {
                $('td',this.el).each(function(n, el){
                    var fade = filter(el);
                    $(fade.elem).fadeTo(fade.speed, fade.level);
                });
            },

            hilightKeyLabels: function() {

                if( this.options.numberSelectEnabled === true ) {
                    this.showRowKbdHints(true);
                    this.forEachCell((function(y, row, x, cell) {
                        $('span',cell).fadeTo(this.options.transitionAnimLength, (x==1) ? 1 : 0);
                    }).bind(this));
                }
            },

            filterByName: function(text) {
                if(text != '') {
                    this.showRowKbdHints(false);
                    this.cellOpacityFilter((function(el){
                        var labelElem = $('span',el);
                        var opacity = ($(labelElem).text().indexOf(text.toLowerCase(),0) == 0) ? 1 : 0;
                        return {
                            elem: labelElem,
                            speed: this.options.quickTransitionLength,
                            level: opacity
                        };
                    }).bind(this));
                } else {
                    this.resetKbdSelection(true);
                }
            },

            filterChanged: function(text) {
                this.filterText = text;
                this.filterByName(this.filterText);
            },

            showRowKbdHints: function( show ) {
                if(this.options.numberSelectEnabled === true) {
                    $('tbody th', this.el).removeClass( (show === false) ? 'rbOn' : 'rbOff').addClass( (show===false) ?'rbOff' : 'rbOn');
                } else {
                    $('tbody th', this.el).removeClass( 'rbOn' ).addClass( 'rbOff');
                }
            },

            resetKbdSelection: function( update ) {
                this.kbdSelectionState = 0;
                this.kbdSelectedRow = -1;
                if(update !== false) {
                    //this.hilightRow(-1);
                    if(this.isMouseHover === true || this.options.numberSelectEnabled === false) {
                        this.mouseEnter(null);
                    } else {
                        console.dir('check!');
                        $('kl', this.el).removeClass('on').addClass('off');
                        this.hilightKeyLabels(true);
                    }
                }

            },

            dbg: function(a,b,c,d) {
                console.log('dbg: a=' + a.toString() + ', b=' + b.toString() + ', c=' + c.toString() + ', d=' + d.toString());
            },

            onNumber: function(ch) {
                if( this.options.numberSelectEnabled !== true) {
                    return;
                }

                console.log('onNumber: ' + ch)
                switch(this.kbdSelectionState) {
                    case 0:
                        if(ch >= 0 && ch <= 8) {
                            this.kbdRowSelected = ch;
                            this.kbdSelectionState++;
                            this.hilightRow(ch-1);
                            this.showRowKbdHints(false);
                        }
                        break;
                    case 1:
                        this.kbdSelectionState=0;
                        if(ch >= 0 && ch <= 3) {
                            var row = +this.kbdRowSelected;
                            this.kbdRowSelected = 0;
                            var selector = 'tr:nth-child(' + (row).toString() + ') td:nth-child(' + (+ch+1).toString() + ')';
                            var elem = $(selector, this.el);
                            this.onSelected(row, ch, elem);
                        } else {
                            $(this.el).css('background-color', '#C00');
                            $('table',this.el).fadeTo(100, 0.25).fadeTo(100,1);
                            this.resetKbdSelection(true);
                        }
                        break;
                    default:
                        this.resetKbdSelection(true);
                        break;
                }
            },

            onSelected: function(row, col, elem) {
                this.resetKbdSelection(false);

                console.log('onSelected: row=' + row + ', col=' + col );
                console.dir(elem);
                $('kl', this.el).removeClass('on').addClass('off');
                $('td', this.el).not(elem).children('span').fadeTo(150, 0);
                $('span',elem).animate({
                    'top':'10px'
                }, 150, 'swing').animate({
                    'top':'0px'
                }, 150, 'swing').animate({
                    'top':'10px'
                }, 150, 'swing').animate({
                    'top':'0px'
                }, 150, 'swing', (function(elem){
                    this.resetKbdSelection(true);
                    //this.options.onSelected(row,col,elem);
                    var selectedCode = window.controller.codeCollection.get($(elem).attr('codeId'))

                    window.controller.onCodeSelected(selectedCode);
                }).bind(this,elem));

            },

            getCurrentCode: function(){
            /*
            var found = $(".CodeListViewItem.found").size();
            if(found==1) {
                return window.controller.codeCollection.get($(".CodeListViewItem.found").data('id'));
            } else {
                return $("#CodeListViewNewCode").text();
            }
            */
            },


            initialize: function() {
                this.options = _.extend(this.defaults, this.options);

                //window.controller.codeCollection.on("change", this.render, this);
                //window.controller.on("filterChanged", this.filterChanged, this);

                this.filterText = '';

                this.render();

                // row and col ids
                this.forEachCell( function(rowIdx, rowEl, colIdx, colEl) {
                    $(colEl).data('rowIdx', rowIdx);
                    $(colEl).data('colIdx', colIdx);

                //$(colEl).data('codeId', '');
                });
            }

        });

        return RainbowGridView;
    });