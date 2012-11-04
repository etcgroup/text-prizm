define(['jquery', 'lib/slick'], function($, Slick) {
    /***
	 * remote data model based on slickgrid's standard grid
	 *
	 *
	 */
    function RemoteModel( options ) {

        var defaults = {
            page_size: 50,
            sort_column: null,
            sort_direction: 1,
            url: null,
            onInit: null
        };

        // private
        var data = {
            length: 0
        };
        var searchstr = null;
        var h_request = null;
        var req = null; // ajax request
        var fields;


        // events
        var onDataLoading = new Slick.Event();
        var onDataLoaded = new Slick.Event();


        function init() {
            options = $.extend({}, defaults, options );
            ensureData(1,1);
        }


        function isDataLoaded(from, to) {
            for (var i = from; i <= to; i++) {
                if (data[i] == undefined || data[i] == null) {
                    return false;
                }
            }

            return true;
        }


        function clear() {
            console.log("clear");
            for (var key in data) {
                delete data[key];
            }
            data.length = 0;
        }


        function ensureData(from, to) {
            if (req) {
                req.abort();
                for (var i = req.fromPage; i <= req.toPage; i++)
                    data[i * options.page_size] = undefined;
            }

            if (from < 0) {
                from = 0;
            }

            var fromPage = Math.floor(from / options.page_size);
            var toPage = Math.floor(to / options.page_size);

            console.log("fromPage: " + fromPage)

            while (data[fromPage * options.page_size] !== undefined && fromPage < toPage)
                fromPage++;

            while (data[toPage * options.page_size] !== undefined && fromPage < toPage)
                toPage--;

            if (fromPage > toPage || ((fromPage == toPage) && data[fromPage * options.page_size] !== undefined)) {
                // TODO:  look-ahead
                return;
            }

            var url = '' + options.url + "?grid&offset=" + (fromPage * options.page_size) + "&limit=" + (((toPage - fromPage) * options.page_size) + options.page_size);

            if(options.sort_column !== null) {
                url += "&order_by=" + options.sort_column;
            }


            if (h_request != null) {
                clearTimeout(h_request);
            }

            h_request = setTimeout(function () {
                for (var i = fromPage; i <= toPage; i++)
                    data[i * options.page_size] = null; // null indicates a 'requested but not available yet'

                onDataLoading.notify({
                    from: from,
                    to: to
                });

                console.dir(url);
                req = $.ajax({
                    url: url,
                    callbackParameter: "callback",
                    context: this,
                    cache: true,
                    success: onSuccess,
                    error: function() {
                        onError(fromPage, toPage);
                    }
                });

                req.fromPage = fromPage;
                req.toPage = toPage;
            }, 50);
        }


        function onError(fromPage, toPage) {
            console.error("error loading pages " + fromPage + " to " + toPage);
        }

        function onSuccess(resp ) {
            var from = req.fromPage * options.page_size, to = from + resp.records;
            data.length = parseInt(resp.total);

            console.log('onSuccess');
            console.dir(req.fromPage);
            console.dir(from);
            console.dir(resp.records);

            for (var i = 0; i < resp.rows.length; i++) {
                data[from + i] = resp.rows[i];
                data[from + i].index = from + i;
            }
            console.dir(resp);
            console.dir(data);

            req = null;

            onDataLoaded.notify({
                from: from,
                to: to
            });

            console.dir(resp.cols);
            console.dir(fields);
            if(resp.cols !== undefined && fields == undefined) {
                console.log('doing columns');
                fields = resp.cols;
                if(options.onInit !== undefined) {
                    options.onInit(loader, fields);
                }
            }
        }


        function reloadData(from, to) {
            for (var i = from; i <= to; i++)
                delete data[i];

            ensureData(from, to);
        }


        function setSort(column, dir) {
            options.sort_column = column;
            options.sort_direction = dir;
            clear();
        }

        function setSearch(str) {
            searchstr = str;
            clear();
        }


        init();

        return {
            // properties
            "data": data,
            "fields": fields,

            // methods
            "clear": clear,
            "isDataLoaded": isDataLoaded,
            "ensureData": ensureData,
            "reloadData": reloadData,
            "setSort": setSort,
            "setSearch": setSearch,

            // events
            "onDataLoading": onDataLoading,
            "onDataLoaded": onDataLoaded
        };
    }

    // Slick.Data.RemoteModel
    $.extend(true, window, {
        Etc: {
            Data: {
                RemoteModel: RemoteModel
            }
        }
    });

    return ETC;
});
