define(['backbone','jquery'], function(Backbone, $) {
    /**
     * Model for retrieving various metrics for understanding code relationships
     */
    var CodePairMetrics = Backbone.Model.extend({
        url: function(){
            return 'ext/code_analysis/pair_metrics?' + $.param(this.attributes);
        }
    });
    return CodePairMetrics;
});
