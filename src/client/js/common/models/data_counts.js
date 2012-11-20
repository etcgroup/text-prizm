define(['backbone'], function(Backbone) {

    /**
     * Model for storing counts info about the data set.
     */
    var DataCounts = Backbone.Model.extend({
        url: function() {
            return 'ext/data_counts/summary?days=' + this.get('days');
        },

        defaults: {
            messages: 0,
            participants: 0,
            codes: 0,
            clusters: 0,
            coded_messages: 0,
            coded_messages_recent: 0,
            coders: 0,
            coders_recent: 0,
            memos: 0,
            memos_recent: 0,
            days: 30
        }
    });
    return DataCounts;
});
