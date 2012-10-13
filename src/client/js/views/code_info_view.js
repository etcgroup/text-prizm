define(['lib/jquery', 'lib/backbone-relational', 'lib/d3', 'lib/date'], function($, Backbone, d3, Date) {

    var CodeInfoView = Backbone.View.extend({
        el: $('#info-box'),

        events: {
            'scroll': 'onScroll',
            'resize': 'render',
            'click' : 'onClick'
        },

        initialize: function() {
            this.selection = undefined;

            this.collection.on('reset', this.onMessagesReset, this);

            this.messageList = $('#message-list-view');
            $(this.messageList).bind('scroll', function(ev) {
                self.onScroll(ev);
            });

            this.messageListHeight = $(this.messageList).height();

            this.visibleWindowTop = 0;
            this.visibleWindowBottom = 0;

            // to find the number of bins, we divide the height by this number
            this.binDivide = 4;

            var self = this;
            this.$el.selectable({
                change: function(event, ui) {
                    self.selectionChanged(ui);
                }
            });
        },

        selectionChanged: function(selection) {

            this.selection = selection;
            var last = $(selection.currentFocus);

            var currentScroll = this.messageList.scrollTop();

            var lastTop = last.position().top;
            var lastBottom = lastTop + last.outerHeight();

            var height = this.messageList.innerHeight();
            if (lastTop < 0){
                this.messageList.scrollTop(lastTop + currentScroll);
            } else if (lastBottom > height) {
                this.messageList.scrollTop(lastBottom + currentScroll - height);
            }

        //this.trigger("selectionChanged", selection);
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

            var dataMin = Date.parse(this.collection.at(0).get('time'));
            var dataMax = Date.parse(this.collection.at(dataLength-1).get('time'));
            var dataRange = (dataMax - dataMin);


            console.log('graphSize (height): ' + graphLength );
            console.log('item count: ' + dataLength );
            console.log('date diff: ' + (dataRange).toString() );

            //if(dataRange > graphLength * this.binDivide) {
            // we need at least 4 item
            binCount = Math.floor(graphLength / this.binDivide);
            binSize = dataRange / binCount;
            //} else {
            //    console.error('arg! dont know what to do!!');
            //}



            console.log('# bins: ' + binCount );

            var width = $(this.el).width(),
            height = graphLength;

            console.log('width: ' + width);
            console.log('height: ' + height);


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
            console.dir(vals);

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
            var binNumber = ev.clientY / this.binDivide;

            console.log('clientY: ' + ev.clientY );
            console.log('binNum: ' + binNumber );

            var clickDate = binNumber * this.binSize + this.binMin;
            var lastDate = this.binMin;

            console.log('clickdate: ' + clickDate );

            $(this.collection).each((function(index,elem){
                var elemDate = Date.parse(this.collection.at(index).get('time'));

                if(elemDate > clickDate) {
                    console.log('elemDate: ' + elemDate );
                    var item = $(this.messageListViewItems)[(index > 0 ? index - 1 : 0)];
                    console.log( $(item).offset().top + ', ' + $(item).position().top)
                    $(this.messageList).scrollTop($(item).offset().top);
                    return false;
                }

                lastDate = elemDate;
            }).bind(this));
        }

    });

    return CodeInfoView;
});
