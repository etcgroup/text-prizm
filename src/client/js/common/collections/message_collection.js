define(['jquery', 'underscore', 'backbone', 'textprizm', 'api', 'moment',
    '../models/message'],
    function($, _, Backbone, TextPrizm, api, moment, Message) {

        var MessageCollection = Backbone.Collection.extend({
            url: api.url('rest/messages'),
            model: Message,

            initialize: function() {
                this.totalMessageCount = null;
            },

            cloneWithoutNullish: function(obj) {
                var result = {};
                _.each(obj, function(value, key) {
                    if (value !== null && value !== undefined) {
                        result[key] = value;
                    }
                });
                return result;
            },

            getMessagesUrl: function(options) {
                options = _.pick(options, 'cluster', 'start', 'offset', 'limit');
                options = this.cloneWithoutNullish(options);

                var url = this.url + '/page?' + $.param(options);

                return url;
            },

            getCountUrl: function(options) {
                var url = this.url + '/count?';

                options = _.pick(options, 'cluster', 'start');

                if (options.start) {
                    //Add a day
                    options.end = moment.utc(options.start, 'YYYY-MM-DD HH:mm:ss');
                    options.end.add('days', 1);
                    options.end = options.end.format('YYYY-MM-DD HH:mm:ss');
                }

                options = this.cloneWithoutNullish(options);
                url += $.param(options);

                return url;
            },

            fetchCluster: function(options) {
                this.options = _.defaults(options, {
                    offset: 0
                });

                this.options = options;

                var url = this.getMessagesUrl(options);

                var terminator = TextPrizm.success({
                    message:'Loading messages...',
                    returnTerminator: true
                });

                return this.fetch({
                    url: url
                }).done(function() {
                    terminator();
                }).error(function() {
                    TextPrizm.error('Error downloading messages!.');
                });
            },

            fetchTotalMessageCount: function() {
                var url = this.getCountUrl(this.options);

                var self = this;
                $.get(url)
                .done(function(count) {
                    self.totalMessageCount = count;
                    self.trigger('total-messages', count, self);
                })
                .error(function(error) {
                    alert("Error counting messages");
                    console.log(error);
                });
            },

            getTotalMessageCount: function() {
                return this.totalMessageCount;
            },

            getSelectionType: function() {
                if (this.options.cluster) {
                    return 'cluster';
                }

                if (this.options.start) {
                    return '24-hour period';
                }

                return '???';
            },

            fetchAllMessages: function() {
                if (this.fetching || this.fetchNoMore) return;
                if (this.totalMessageCount === null) {
                    alert("Can't fetch all messages without counting first");
                    return;
                }

                this.fetching = true;

                var self = this;

                this.options.offset = this.size();
                var options = _.clone(this.options);
                options.limit = this.totalMessageCount - this.options.offset;

                var subCollection = new MessageCollection();

                subCollection.fetchCluster(options)
                .done(function() {
                    if (subCollection.size() == 0) {
                        TextPrizm.warning('No more messages.');
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
                    }, self);

                    self.fetching = false;
                })
                .error(function() {
                    self.fetching = false;
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
                        TextPrizm.warning('No more messages.');
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
                    }, self);

                    self.fetching = false;
                })
                .error(function() {
                    self.fetching = false;
                });
            }
        });
        return MessageCollection;
    });
