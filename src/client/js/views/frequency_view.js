define(['lib/jquery', 'lib/backbone-relational', 'lib/underscore', 'lib/d3', 'lib/date'],
    function($, Backbone, _, d3, Date) {

        var FrequencyView = Backbone.View.extend({
            el: $('#frequency-view'),

            events: {
                'scroll': 'onScroll',
                'click' : 'onClick'
            },



            initialize: function() {
                var self = this;
                this.collection.on('reset', this.onMessagesReset, this);

                this.messageList = $('#message-list-view');
                $(this.messageList).bind('scroll', function(ev) {
                    self.onScroll(ev);
                });

                $(window).bind("resize.etc", _.bind(this.render, this));

                this.messageListHeight = $(this.messageList).height();

                this.visibleWindowTop = 0;
                this.visibleWindowBottom = 0;

                // to find the number of bins, we divide the height by this number
                this.binDivide = 4;


            },

            render: function() {
                var self = this;

                $(this.el).empty();

                var bin = 0,
                binCount = 0,
                binSize = 0,
                graphLength = 0,
                dataLength = 0;


                graphLength = $(this.el).height();
                dataLength = this.collection.length;

                if (this.collection.size() == 0) {
                    return this;
                }

                var dataMin = Date.parse(this.collection.at(0).get('time'));
                var dataMax = Date.parse(this.collection.at(dataLength-1).get('time'));
                var dataRange = (dataMax - dataMin);


                //console.log('graphSize (height): ' + graphLength );
                //console.log('item count: ' + dataLength );
                //console.log('dataMin: ' + +dataMin );
                //console.log('dataMax: ' + +dataMax );
                //console.log('date diff: ' + (dataRange).toString() );

                binCount = Math.floor(graphLength / this.binDivide);
                binSize = dataRange / binCount;



                //console.log('# bins: ' + binCount );

                var width = $(this.el).width(),
                height = graphLength;

                //console.log('width: ' + width);
                //console.log('height: ' + height);


                var hist = d3.layout.histogram().value(
                    function(d){
                        return Date.parse(d.get('time'));
                    }).bins(binCount)(this.collection);


                var y = d3.scale.ordinal()
                .domain(hist.map(function(d,i) {
                    return i;
                }))
                .rangeRoundBands([0,height]);

                var x = d3.scale.linear()
                .domain([0, d3.max(hist.map(function(d) {
                    return d.length;
                }))])
                .range([0, width/2]);

                var svg = d3.select(this.el).append("svg")
                .attr("width", width)
                .attr("height", height);


                var vals = hist.map( function(d,i) {
                    return {
                        y: y(i),
                        x: x(d.length)
                    };
                });
                //console.dir(vals);

                var area = d3.svg.area()
                .y0(function(d,i) {
                    return d.y;
                })
                .y1(function(d,i) {
                    return d.y;
                })
                .x0(function(d,i) {
                    return (width/2) + d.x;
                })
                .x1(function(d,i) {
                    return (width/2) - d.x;
                });

                // do our window
                this.binMin = dataMin;
                this.binMax = dataMax;
                this.binCount = binCount;
                this.binSize = binSize;

                this.calculateScrollWindow();

                svg.append("rect")
                .attr("x", 0)
                .attr("y", this.visibleWindowTop)
                .attr("width", width-1)
                .attr("height", (this.visibleWindowBottom - this.visibleWindowTop) + 1);


                svg.append("line")
                .attr("x1", width/2)
                .attr("x2", width/2)
                .attr("y1", 0)
                .attr("y2", height);


                svg.selectAll("path")
                .data([vals])
                .enter().append("path")
                .attr("d", area);


            },

            onScroll: function(a,b) {

                this.calculateScrollWindow();

                d3.select(this.el).selectAll("rect")
                .attr("y", this.visibleWindowTop)
                .attr("height", (this.visibleWindowBottom - this.visibleWindowTop) + 1);
            },


            findBinNumber: function(val) {
                return (val - this.binMin) / this.binSize;
            },

            calculateScrollWindow: function() {
                this.visibleWindowTop = 0;
                this.visibleWindowBottom = 0;

                var startOffset = Number.MAX_VALUE,
                endOffset = -1,
                startIndex = -1,
                endIndex = -1,
                height = this.messageListHeight;

                $(this.messageListViewItems).each(function(index,elem){
                    var offset = $(elem).offset();
                    if( offset.top >= 0 ) {
                        if( offset.top < startOffset ) {
                            startOffset = offset.top;
                            startIndex = index;
                        //console.log('found top visible: ' + offset.top + ' , ' + index );
                        }

                        if( startOffset >= 0 && offset.top < height) {
                            endIndex = index;
                            endOffset = offset.top;
                        }

                        // break the loop
                        if(offset.top > height) {
                            return false;
                        }
                    }
                });

                var topDate = this.collection.at(startIndex).get('time'),
                bottomDate = this.collection.at(endIndex).get('time');

                this.visibleWindowTop = Math.floor(this.findBinNumber( Date.parse(topDate) ) * this.binDivide);
                this.visibleWindowBottom = Math.ceil(this.findBinNumber( Date.parse(bottomDate) ) * this.binDivide);

            //console.log('winTop: ' + this.visibleWindowTop );
            //console.log('winBot: ' + this.visibleWindowBottom );
            },


            onMessagesReset: function() {
                this.messageListViewItems = $('li', this.messageList);

                this.render();
            },

            onClick: function(ev) {
                var self = this;
                var binNumber = (ev.clientY - $(ev.currentTarget).offset().top)  / this.binDivide;

                //console.log('clientY: ' + (ev.clientY - $(ev.currentTarget).offset().top) );
                //console.log('binNum: ' + binNumber );
                //console.log('binMin: ' + +this.binMin );

                var clickDate = binNumber * this.binSize + +this.binMin;
                var lastDate = this.binMin;

                //console.log('clickdate: ' + clickDate );

                var elem = this.collection.find(function(elem,index){
                    var elemDate = Date.parse(self.collection.at(index).get('time'));

                    if(+elemDate > +clickDate) {
                        //console.log('elemDate: ' + elemDate );
                        //$(this.messageList).scrollTop($(item).offset().top);
                        return true;
                    }

                    return false;
                });


                // need index

                //var item = $(this.messageListViewItems)[(+elem.get('idx') >= 0 ? +elem.get('idx') : 0)];
                var item = $('[data-message_id="' + elem.get('id') + '"]', this.messageListViewItems);
                //console.log( $(item).offset().top + ', ' + $(item).position().top);
                $(item)[0].offsetParent.scrollIntoView(false);


            /*
            this.collection.each((function(elem,index){
                var elemDate = Date.parse(this.collection.at(index).get('time'));

                if(+elemDate > +clickDate) {
                    //console.log('elemDate: ' + elemDate );
                    var item = $(this.messageListViewItems)[(index > 0 ? index - 1 : 0)];
                    //console.log( $(item).offset().top + ', ' + $(item).position().top);
                    $(item)[0].scrollIntoView(true);
                    //$(this.messageList).scrollTop($(item).offset().top);
                    return false;
                }

                lastDate = elemDate;
            }).bind(this));
            */
            },


            resize: function() {
                if(this.timer !== false) {
                    clearTimeout(this.timer);
                }
                //TODO: what is render? - Michael
                this.timer = setTimeout(render, 250);
            }

        });

        return FrequencyView;
    });