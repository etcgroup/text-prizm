define(['jquery', 'lib/d3'], function($, d3) {

    function ETCBarGraph(options) {
        var defaults = {
            margins: [40,60,60,60],
            data: null,
            scale: 'linear',
            barSpacing: 0.25,
            xAxisTickCount: -1,
            yAxisTickCount: -1,
            layout: 'horizontal'
        };

        var opt = {},
        m = [],
        width = 0,
        height = 0,
        w = 0,
        h = 0,
        x,
        y,
        xAxis,
        yAxis,
        vis = null;


        function init() {
            if( typeof options === 'object' ) {
                opt = $.extend(defaults, options);
            } else {
                opt = defaults;
            }

            m = opt.margins;
            width = opt.width || $(opt.elementId).width();
            height = opt.height || $(opt.elementId).height();
            w = width - m[1] - m[3],
            h = height - m[0] - m[2];

            render();
        }


        function initAxes() {
            switch(opt.layout) {
                case 'horizontal':
                    x = d3.scale.ordinal().rangeBands([0, w], opt.barSpacing),
                    y = d3.scale.linear().range([h, 0]);
                    xAxis = d3.svg.axis().scale(x);
                    yAxis = d3.svg.axis().scale(y).tickSize(-w).tickSubdivide(false).orient("left");
                    x.domain(opt.data.map(function(d) {
                        return d.name;
                    }));
                    y.domain([0, d3.max(opt.data, function(d) {
                        return d.value;
                    })]);
                    break;
                case 'vertical':
                    y = d3.scale.ordinal().rangeBands([h, 0], opt.barSpacing),
                    x = d3.scale.linear().range([0, w]);
                    yAxis = d3.svg.axis().scale(y).orient("left");
                    xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(false);
                    y.domain(opt.data.map(function(d) {
                        return d.name;
                    }));
                    x.domain([0, d3.max(opt.data, function(d) {
                        return d.value;
                    })]);
                    break;
                case 'radial':
                    break;
            }
            if(opt.xAxisTickCount >= 0 ) {
                xAxis.ticks(opt.xAxisTickCount);
            }
            if(opt.yAxisTickCount >= 0 ) {
                yAxis.ticks(opt.yAxisTickCount);
            }
        }


        function updateAxes() {
            switch(opt.layout) {
                case 'horizontal':
                    x.domain(opt.data.map(function(d) {
                        return d.name;
                    }));
                    y.domain([0, d3.max(opt.data, function(d) {
                        return d.value;
                    })]);
                    break;
                case 'vertical':
                    y.domain(opt.data.map(function(d) {
                        return d.name;
                    }));
                    x.domain([0, d3.max(opt.data, function(d) {
                        return d.value;
                    })]);
                    break;
                case 'radial':
                    break;
            }

            xAxis.scale(x);
            yAxis.scale(y);
        }


        function render() {
            var self = this;

            initAxes();

            var svg = d3.select(opt.elementId)
            .append("svg")
            .attr("width", w + m[1] + m[3])
            .attr("height", h + m[0] + m[2] );

            vis = svg.append("g")
            .attr("transform", "translate(" + m[3] + "," + m[0] + ")");


            // Add the x-axis.
            var axis = vis.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + h + ")")
            .call(xAxis);


            if(opt.xAxisLabelsRotate >= 0) {
                axis.selectAll('text')
                .style("text-anchor", "start");
            }


            // Add the y-axis.
            vis.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0,0)")
            .call(yAxis);




            update(opt.data);
        }


        function update(data) {
            var self = this;

            opt.data = data;

            console.log("update");
            //console.dir(data[0].value);

            updateAxes();

            var t = vis.transition().duration(500).ease("exp-in-out");
            t.select(".x.axis").call(xAxis);
            t.select(".y.axis").call(yAxis);


            if(opt.xAxisLabelsRotate >= 0) {
                vis.selectAll('.x.axis text')
                .style("text-anchor", "start")
                .attr("transform", function(d) {
                    return "translate(" + (this.getBBox().height/2) + ",0)rotate(" + opt.xAxisLabelsRotate + ")";
                });
            }


            var bars = vis.selectAll(".bar")
            .data(opt.data, function(d,i) {
                return d.id;
            });

            //console.dir(bars);

            switch(opt.layout) {
                case 'horizontal':
                    bars.enter().append("rect").attr("class", "bar")
                    .attr("x", function(d) {
                        return x(d.name);
                    })
                    .attr("y", h)
                    .attr("height", 0)
                    .attr("width", x.rangeBand());

                    bars.transition().duration(500).ease('exp-in-out')
                    .attr("x", function(d) {
                        return x(d.name);
                    })
                    .attr("y", function(d) {
                        return y(d.value);
                    })
                    .attr("height", function(d) {
                        return h- y(d.value);
                    })
                    .attr("width", x.rangeBand());

                    bars.exit()
                    .transition().duration(500).ease("exp-in-out")
                    .attr('x', 0)
                    .attr('width', 0)
                    .remove();
                    break;

                case 'vertical':
                    bars.enter().append("rect").attr("class", "bar")
                    .attr("y", function(d) {
                        return y(d.name);
                    })
                    .attr("height", y.rangeBand())
                    .attr("width", 0);


                    bars.transition().duration(500).ease('exp-in-out')
                    .attr("y", function(d) {
                        return y(d.name);
                    })
                    .attr("height", y.rangeBand())
                    .attr("width", function(d) {
                        //console.log(d.name + '('+ d.id + ')' + ': ' + d.value + ' [' + x(d.value) + ']');
                        //console.log(x(d.value));
                        return x(d.value);
                    });

                    bars.exit()
                    .transition().duration(500).ease("exp-in-out")
                    .attr('y', 0)
                    .attr('width', 0)
                    .remove();
                    break;
                default:
                    break;
            }
        }


        init();

        return {
            // properties
            "data": opt.data,

            // functions
            "render": render,
            "update": update
        };


    }

    // ETC.Graph.Bar
    $.extend(true, window, {
        ETC: {
            Graph: {
                Bar: ETCBarGraph
            }
        }
    });


    function render_bar(options) {
        var defaults = {
            margins: [40,60,60,60],
            data: null,
            scale: 'linear',
            barSpacing: 0.25,
            layout: 'horizontal'
        };

        if( typeof options === 'object' ) {
            options = $.extend(defaults, options);
        } else {
            options = defaults;
        }


        var  m = options.margins,
        width = options.width || $(options.elementId).width(),
        height = options.height || $(options.elementId).height(),
        w = width - m[1] - m[3],
        h = height - m[0] - m[2],
        x = null,
        y = null,
        xAxis = null,
        yAxis = null;

        switch(options.layout) {
            case 'horizontal':
                x = d3.scale.ordinal().rangeBands([0, w], options.barSpacing),
                y = d3.scale.linear().range([h, 0]);
                xAxis = d3.svg.axis().scale(x);
                yAxis = d3.svg.axis().scale(y).tickSize(-w).tickSubdivide(false).orient("left");
                x.domain(options.data.map(function(d) {
                    return d.name;
                }));
                y.domain([0, d3.max(options.data, function(d) {
                    return d.value;
                })]);
                break;
            case 'vertical':
                y = d3.scale.ordinal().rangeBands([h, 0], options.barSpacing),
                x = d3.scale.linear().range([0, w]);
                yAxis = d3.svg.axis().scale(y).orient("left");
                xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(false);
                y.domain(options.data.map(function(d) {
                    return d.name;
                }));
                x.domain([0, d3.max(options.data, function(d) {
                    return d.value;
                })]);
                break;
            case 'radial':
                break;
        }


        var svg = d3.select(options.elementId)
        .append("svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2] );

        var vis = svg.append("g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

        // Add the x-axis.
        var axis = vis.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);

        axis.selectAll("text")
        .attr("transform", function(d) {
            return "rotate(45)translate(" + ((this.getBBox().width/2) + 10)  + "," +
            -(this.getBBox().height/2) + ")";
        });

        // Add the y-axis.
        vis.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0,0)")
        .call(yAxis);


        var bar = vis.selectAll("g.bar")
        .data(options.data, function(d,i) {
            return "id" in d ? d.id : i;
        })
        .enter().append("g")
        .attr("class", "bar");

        switch(options.layout) {
            case 'horizontal':
                bar.append("rect")
                .attr("transform", function(d) {
                    return "translate(" +  x(d.name) + ", 0)";
                })
                .attr("y", function(d) {
                    return y(d.value);
                })
                .attr("height", function(d) {
                    return h- y(d.value);
                })
                .attr("width", x.rangeBand());
                break;
            case 'vertical':
                bar.append("rect")
                .attr("transform", function(d) {
                    return "translate(0, " +  y(d.name) + ")";
                })
                .attr("height", y.rangeBand())
                .attr("width", function(d) {
                    return x(d.value);
                });
                break;
            default:
                break;
        }


    }

    return ETC;
});