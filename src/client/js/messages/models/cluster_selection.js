define(['backbone'], function(Backbone) {
    /**
     * Model for cluster selection information.
     */
    var ClusterSelection = Backbone.Model.extend({
        defaults: {
            cluster_id: null,
            start_date: null
        },

        setClusterId: function(clusterId) {
            this.set({
                cluster_id: clusterId,
                start_date: null
            });
        },

        setStartDate: function(startDate) {
            this.set({
                cluster_id: null,
                start_date: startDate.format('YYYY-MM-DD HH:mm:ss')
            });
        },

        getAddress: function() {
            if (this.get('cluster_id')) {
                return '/cluster/' + this.get('cluster_id');
            } else if (this.get('start_date')) {
                return '/start/' + this.get('start_date');
            } else {
                return '';
            }
        }
    });
    return ClusterSelection;
});
