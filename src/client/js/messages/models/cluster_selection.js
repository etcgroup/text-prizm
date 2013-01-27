define(['backbone'], function(Backbone) {
    /**
     * Model for cluster selection information.
     */
    var ClusterSelection = Backbone.Model.extend({
        defaults: {
            cluster: null,
            start: null
        },

        setClusterId: function(clusterId) {
            this.set({
                cluster: clusterId,
                start: null
            });
        },

        setStartDate: function(startDate) {
            this.set({
                cluster: null,
                start: startDate.format('YYYY-MM-DD HH:mm:ss')
            });
        },

        getAddress: function() {
            if (this.get('cluster')) {
                return '/cluster/' + this.get('cluster');
            } else if (this.get('start')) {
                return '/start/' + this.get('start');
            } else {
                return '';
            }
        },

        /**
         * Returns true if the selection is set.
         */
        hasSelection: function () {
            return this.get('cluster') || this.get('start');
        }
    });
    return ClusterSelection;
});
