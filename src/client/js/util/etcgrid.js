define(function(require) {
    var $ = require('jquery'),
    Slick = require('lib/slick.core');
    require('lib/slick.grid');
    require('lib/slick.dataview');
    require('lib/slick/slick.rowselectionmodel');


    function EtcGrid( options ) {
        var defaults = {
            gridOptions: {
                editable: false,
                enableAddRow: false,
                enableCellNavigation: false
            }
        };

        // private
        var loader;
        var grid;


        function init() {

        }





        init();


        return {
            // properties
            "grid": grid,
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




    function createGrid() {
        //jqlayout = $('body').layout({applyDefaultStyles:       true});
        //jqlayout.sizePane("west", 300);

        var options = {
            editable: false,
            enableAddRow: false,
            enableCellNavigation: false
        };

        grid = new Slick.Grid("#testgrid", loader.data, loader.fields, options);

        grid.onViewportChanged.subscribe(function (e, args) {
            var vp = grid.getViewport();
            loader.ensureData(vp.top, vp.bottom);
        });

        grid.onSort.subscribe(function (e, args) {
            loader.setSort(args.sortCol.field, args.sortAsc ? 1 : -1);
            var vp = grid.getViewport();
            loader.ensureData(vp.top, vp.bottom);
        });

        loader.onDataLoading.subscribe(function () {
            if (!loadingIndicator) {
                loadingIndicator = $("<span class='loading-indicator'><label>Buffering...</label></span>").appendTo(document.body);
                var $g = $("#testgrid");

                loadingIndicator
                .css("position", "absolute")
                .css("top", $g.position().top + $g.height() / 2 - loadingIndicator.height() / 2)
                .css("left", $g.position().left + $g.width() / 2 - loadingIndicator.width() / 2);
            }

            loadingIndicator.show();
        });

        loader.onDataLoaded.subscribe(function (e, args) {
            for (var i = args.from; i <= args.to; i++) {
                grid.invalidateRow(i);
            }

            grid.updateRowCount();
            grid.render();

            loadingIndicator.fadeOut();
        });

        grid.autosizeColumns();

        $("#txtSearch").keyup(function (e) {
            if (e.which === 13) {
                loader.setSearch($(this).val());
                var vp = grid.getViewport();
                loader.ensureData(vp.top, vp.bottom);
            }
        });

        // load the first page
        grid.onViewportChanged.notify();



    }




    function addGrid(el, data, columns, options) {
        var grid;

        var dataView = new Slick.Data.DataView({
            inlineFilters: true
        });
        grid = new Slick.Grid(el, data, columns, options);
        grid.setSelectionModel(new Slick.RowSelectionModel());


        grid.onSort.subscribe(function(e,args){
            var sortDir = args.sortAsc ? 1 : -1;
            var sortCol = args.sortCol.field;

            dataView.beginUpdate();
            dataView.sort(function(a,b){
                var x = a[sortCol], y = b[sortCol];
                return (x === y ? 0 : (x > y ? 1 : -1));
            }, args.sortAsc);

            dataView.endUpdate();

            //dataView.reSort();
            //
            grid.invalidate();
        //grid.render();
        });


        dataView.beginUpdate();
        dataView.setItems(data);
        //dataView.setFilterArgs({
        //    percentCompleteThreshold: percentCompleteThreshold,
        //    searchString: searchString
        //});
        //dataView.setFilter(myFilter);
        dataView.endUpdate();
        //grid.render();


        return grid;
    }

    return addGrid;
});