define(['underscore',
    'textprizm',
    'jquery',
    'triage/models/code_pair_metrics',
    'triage/views/pair_metrics_table_view'],
    function(
        _,
        TextPrizm,
        $,
        CodePairMetrics,
        PairMetricsTableView) {

        /**
         * A collection of functions that control the triage workbench
         */
        var TriageController = function() {
        };

        _.extend(TriageController.prototype, {
            start: function() {
                var collection = new Backbone.Collection();
                var view = new PairMetricsTableView({
                    collection: collection
                });
                TextPrizm.pairMetrics.show(view);
                var metrics = new CodePairMetrics({
                    "id_a":3, 
                    "id_b":5
                });
                metrics.fetch()
                .done(function(){
                    collection.add(metrics);
                });
            }
        });
        return TriageController;

    });
