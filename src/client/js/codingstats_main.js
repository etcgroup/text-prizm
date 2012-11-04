define(function(require) {
    var $ = require('jquery');
    require('jqueryui');
    var Spinner = require('lib/spin');
    var d3 = require('lib/d3'),
    colorbrewer = require('lib/colorbrewer'),
    ETC = require('util/etc-graph'),
    addGrid = require('util/etcgrid');


    lines_by_person = lines_by_person.map(function(d,i){
        d.id = +d.id;
        d.total = +d.total;
        d.week = +d.week;
        d.month = +d.month;
        return d;
    });

    codes_by_line = codes_by_line.map(function(d,i){
        d.id = +d.id;
        d.total = +d.total;
        d.week = +d.week;
        d.month = +d.month;
        return d;
    });

    /*

            You can now create a spinner using any of the variants below:

            $("#el").spin(); // Produces default Spinner using the text color of #el.
            $("#el").spin("small"); // Produces a 'small' Spinner using the text color of #el.
            $("#el").spin("large", "white"); // Produces a 'large' Spinner in white (or any valid CSS color).
            $("#el").spin({ ... }); // Produces a Spinner using your custom settings.

            $("#el").spin(false); // Kills the spinner.

	 */
    (function($) {
        $.fn.spin = function(opts, color) {
            var presets = {
                "tiny": {
                    lines: 8,
                    length: 2,
                    width: 2,
                    radius: 3
                },
                "small": {
                    lines: 8,
                    length: 4,
                    width: 3,
                    radius: 5
                },
                "large": {
                    lines: 10,
                    length: 8,
                    width: 4,
                    radius: 8
                }
            };
            if (Spinner) {
                return this.each(function() {
                    var $this = $(this),
                    data = $this.data();

                    if (data.spinner) {
                        data.spinner.stop();
                        delete data.spinner;
                    }
                    if (opts !== false) {
                        if (typeof opts === "string") {
                            if (opts in presets) {
                                opts = presets[opts];
                            } else {
                                opts = {};
                            }
                            if (color) {
                                opts.color = color;
                            }
                        }
                        data.spinner = new Spinner($.extend({
                            color: $this.css('color')
                            }, opts)).spin(this);
                    }
                });
            } else {
                throw "Spinner class not available.";
            }
        };
    })($);


    function render(el, data) {
        var m = [19, 20, 20, 19],
        parse = d3.time.format("%m/%d/%y").parse
        //parse = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

        var width = $(el).width(),
        height = $(el).height();


        var w = width - m[1] - m[3], // width
        h = 120 - m[0] - m[2], // height
        z = 14; // cell size

        var day = d3.time.format("%w"),
        week = d3.time.format("%U"),
        percent = d3.format(".1%"),
        format = d3.time.format("%Y-%m-%d"),
        linkformat = d3.time.format("%Y-%m-%d");


        var color = d3.scale.quantize()
        .domain([1, 3000])
        .range(d3.range(8));

        var color2 = d3.scale.quantize()
        .domain([1, 3000])
        .range(d3.range(8));

        var svg = d3.select(el).selectAll("svg")
        .data(d3.range(2004, 2009))
        .enter().append("svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
        .attr("class", "Greys")
        .append("g")
        .attr("transform", "translate(" + (m[3] + (w - z * 53) / 2) + "," + (m[0] + (h - z * 7) / 2) + ")");

        svg.append("text")
        .attr("transform", "translate(-6," + z * 3.5 + ")rotate(-90)")
        .attr("text-anchor", "middle")
        .text(String);

        var rect = svg.selectAll("a")
        .data(function(d) {
            return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
        .enter().append("a").attr("xlink:href", function(d) {
            return "coding#" + linkformat(d) + "%2000:00:00/" + linkformat(d) + "%2023:59:59";
        })
        .append("rect")
        .attr("class", "day")
        .attr("width", z)
        .attr("height", z)
        .attr("x", function(d) {
            return week(d) * z;
        })
        .attr("y", function(d) {
            return day(d) * z;
        })
        .datum(format);

        svg.selectAll("path.month")
        .data(function(d) {
            return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
        .enter().append("path")
        .attr("class", "month")
        .attr("d", monthPath);


        rect.filter(function(d)
        {
            return d in data;
        })
        .attr("class", function(d) {
            var cls = "day q" + (color(data[d][0])+1) + "-9";
            if( data[d][1] > 0) {
                //cls += " Grnq" + (9- color2(data[d][1])) + "-9 hasCodes";
                cls = "day YlOrRdq" + (color2(data[d][0])+1) + "-9 hasCodes";
            } else {
                if(data[d][0] > 0 ) {
                    cls = "day q" + (color(data[d][0])+1) + "-9";
                } else
{
                    cls = "day q0-9";
                }

            }
            return cls;
        });
        /*
                    .attr("width", function(d) {
                        return data[d][1] > 0 ? z - 2 : z;
                    })
                    .attr("height", function(d){
                        return data[d][1] > 0 ? z - 2 : z;
                    });
		 */

        // tooltip data/info
        var tip = $('#tooltip');
        $('svg').mousemove(data, function(ev){
            //console.dir(e);
            var elData = ev.srcElement.__data__;
            if(ev.srcElement.nodeName == "rect" && elData !== undefined && elData in data ) {
                tip.offset({
                    top: ev.pageY + 20,
                    left: ev.pageX + 20
                });
                $('#tooltip_content').html( function() {
                    var retMessage = '<table><tr><td>' +
                    'Total Messages:</td><td>' + data[elData][0] + '</td></tr>';
                    if(data[elData][1] > 0) {
                        var pct = Math.round(data[ elData ][3]);
                        retMessage += '<tr><td>Progress:</td><td>' +
                        '<div class="prbar">' +
                        '<div class="prbar_inner" style="width:' + pct + '%;"/>' +
                        '</div>' +
                        pct + '%</td></tr>' +
                        '<tr><td>Lines Coded:</td><td>' + data[ elData ][2] + '</td></tr>' +
                        '<tr><td>Total Codes:</td><td>' + data[ elData ][1] + '</td></tr>';
                    }
                    retMessage += '</table>';
                    return retMessage;
                });

                $('#tooltip_hdr').html(
                    elData
                    );
            //$('#tooltip').css('top: ' + ev.pageY + 'px; left: ' + ev.pageX + 'px;');
            } else {
                tip.offset({
                    top: -2000,
                    left: -2000
                });
            }
        });






        //console.dir(data);

        function monthPath(t0) {
            var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = +day(t0), w0 = +week(t0),
            d1 = +day(t1), w1 = +week(t1);
            return "M" + (w0 + 1) * z + "," + d0 * z
            + "H" + w0 * z + "V" + 7 * z
            + "H" + w1 * z + "V" + (d1 + 1) * z
            + "H" + (w1 + 1) * z + "V" + 0
            + "H" + (w0 + 1) * z + "Z";
        }


        var params = [
        {
            label:'message count',
            css_class: 'Greys',
            class_suffix: '-9',
            scale: color
        },

        {
            label:'message count(coded)',
            css_class: 'YlOrRd',
            class_suffix: '-9',
            scale: color2
        } ];
        var lgnd = '';

        $.each(params, function(i,d){
            lgnd += '<h4>' + d.label +'</h4>';

            var domain_min = d.scale.domain()[0];
            var domain_range = d.scale.domain()[1] - domain_min;
            var discrete_range_values = d.scale.range().length;
            var step = domain_range / discrete_range_values;
            lgnd += '<table class="lgnd ' + d.css_class + '">';
            lgnd += '<tr>';
            lgnd += '<td style="background-color:' + colorbrewer[d.css_class][9][0] + '"></td>';
            lgnd += '<td></td>';
            lgnd += '<td>0</td>';
            lgnd += '</tr>';
            $.each(d.scale.range(), function(sc_idx,scale){
                lgnd += '<tr>';
                lgnd += '<td style="background-color:' + colorbrewer[d.css_class][9][(scale+1).toString()] + '"></td>';
                lgnd += '<td></td>';
                lgnd += '<td>' + (Math.round((scale*step) + domain_min)).toString() + '</td>';
                lgnd += '</tr>';
            });
            lgnd += '</table>';
        });

        $('#legend').html(lgnd);



    }



    $(window).load(function() {
        $('#chart').empty();
        var format = d3.time.format("%Y-%m-%d");



        var spinner = $('#chart').first().spin("small" );


        d3.csv("api/codingstats/codingfreqpeople.csv", function(csv) {
            var data = d3.nest()
            .key(function(d) {
                var localDate = format.parse(d.date);

                return format(new Date(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate()));
            })
            .rollup(function(d) {
                return [ +d[0].cnt, +d[0].codecnt, +d[0].linescoded, +d[0].pctcoded ];
            })
            .map(csv);

            render('#chart', data);
            spinner.spin(false);
        });


        var totalGrid = addGrid('#codes_total', lines_by_person, [
        {
            id: "user",
            name: "User",
            field: "user",
            sortable: true
        },
{
            id: "total",
            name: "Total",
            field: "total",
            sortable: true
        },
{
            id: "month",
            name: "Last 30 days",
            field: "month",
            sortable: true
        },
{
            id: "week",
            name: "Last 7 days",
            field: "week",
            sortable: true
        }
        ], {
            enableColumnReorder: true,
            fullWidthRows: true,
            autoSizeColumns: true,
            forceFitColumns: true
        });


        var codeGrid = addGrid('#affective_codes', codes_by_line, [
        {
            id: "code",
            name: "Code",
            field: "code",
            sortable: true
        },
{
            id: "total",
            name: "Total",
            field: "total",
            sortable: true
        },
{
            id: "month",
            name: "Last 30 days",
            field: "month",
            sortable: true
        },
{
            id: "week",
            name: "Last 7 days",
            field: "week",
            sortable: true
        }
        ], {
            enableColumnReorder: true,
            fullWidthRows: true,
            autoSizeColumns: true,
            forceFitColumns: true
        });

        /*
                var codeDatesGrid = addGrid('#codes', codes_by_date, [
                    { id: "code", name: "Code", field: "code", sortable: true },
                    { id: "counts", name: "count", field: "counts", sortable: true },
                    { id: "date_added", name: "Date", field: "date_added", sortable: true },
                ], { enableColumnReorder: true, fullWidthRows: true, autoSizeColumns: true, forceFitColumns: true});
		 */

        // bar charts
        var totalCodesGraph = new ETC.Graph.Bar({
            elementId: '#codes_total_chart',
            data: lines_by_person.map( function(d,i) {
                return {
                    id: d.id,
                    name: d.user,
                    value: d.total
                };
            }),
            width: 800,
            height: 300
        });

        var affectiveCodesGraph = new ETC.Graph.Bar({
            elementId: '#affective_codes_chart',
            data: codes_by_line.map( function(d,i){
                return {
                    id: d.id,
                    name: d.code,
                    value: d.total
                };
            }),
            width: 1600,
            height: 300,
            xAxisLabelsRotate: 45,
            margin: [10,20,60,60]
        });



    });
});