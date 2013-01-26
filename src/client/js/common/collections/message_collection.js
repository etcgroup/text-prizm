define(['backbone', 'api', '../models/message'], function(Backbone, api, Message) {

    var MessageCollection = Backbone.Collection.extend({
        url: api.url('rest/messages'),
        model: Message,

        fetchCluster: function(options) {
            this.options = _.defaults(options, {
                offset: 0,
                cluster_id: 1
            });

            this.options = options;

            var url = this.url;
            if (options.cluster_id) {
                url += '/page?cluster_id=' + options.cluster_id;
            } else if (options.start_date) {
                url += '/page?start=' + options.start_date;
            }

            url += '&offset=' + options.offset;

            return this.fetch({
                url: url
            });
        },

        fetchMoreMessages: function() {
            if (this.fetching || this.fetchNoMore) return;
            this.fetching = true;

            var self = this;

            this.options.offset = this.size();
            var options = _.clone(this.options);

            var subCollection = new MessageCollection();

            subCollection.fetchCluster(options)
            .done(function() {
                if (subCollection.size() == 0) {
                    self.fetchNoMore = true;
                    return;
                }

                var from = self.size();
                var to = from + subCollection.size();

                self.add(subCollection.models, {
                    silent: true
                });

                self.trigger('batch-add', {
                    from: from,
                    to: to
                });

                self.fetching = false;
            })
            .error(function() {
                alert('Unable to load messages');
                self.fetching = false;
            });
        }
    });
    return MessageCollection;
});
