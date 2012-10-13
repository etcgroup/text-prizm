define(['lib/jquery', 'lib/backbone-relational', 'lib/date', 'models/message_model'],
    function($, Backbone, Date, Message) {

        var MessageCollection = Backbone.Collection.extend({
            model: Message,

            fetch: function(options) {
                var self = this;

                var startQuery = new Date();
                $.get('api/data/points', options.data, 'json')
                .done(function(messages) {

                    var stopQuery = new Date();

                    console.log('Time to get data points: ' + ((stopQuery.getTime() - startQuery.getTime())/1000.0) + ' seconds');

                    startQuery = new Date();

                    for (var i = 0; i < messages.length; i++) {
                        var msg = messages[i];
                        if (i == 0) {
                            msg.speaker_changed = true;
                        } else {
                            var prev = messages[i-1];
                            msg.speaker_changed = msg.participant_id != prev.participant_id;
                        }
                    }

                    self.reset(messages);

                    stopQuery = new Date();

                    console.log('Time to process data points: ' + ((stopQuery.getTime() - startQuery.getTime())/1000.0) + ' seconds');

                    if (options.success)
                        options.success();

                })
                .fail(function() {
                    console.log("failure");
                    if (options.error)
                        options.error();
                });
            }
        });
        return MessageCollection;
    });