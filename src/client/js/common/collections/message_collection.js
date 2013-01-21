define(['backbone', 'api', '../models/message'], function(Backbone, api, Message) {

    var MessageCollection = Backbone.Collection.extend({
        url: api.url('rest/messages'),
        model: Message,

        fetchCluster: function(options) {
            var url = this.url;
            if (options.cluster_id) {
                url += '/page?cluster_id=' + options.cluster_id;
            } else if (options.start_time) {
                url += '/page?start=' + options.start_time;
            }

            return this.fetch({
                url: url
            });
        }
    });
    return MessageCollection;
});
