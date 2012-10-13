define(['lib/backbone-relational', 'models/participant_model'],
    function(Backbone, Participant) {

        var Message = Backbone.RelationalModel.extend({
            relations: [{
                type: Backbone.HasOne,
                key: 'participant',
                keySource: 'participant_id',
                includeInJSON: 'id',
                relatedModel: Participant,
                reverseRelation: {
                    key: 'messages',
                    includeInJSON: 'id'
                }
            }]
        });
        return Message;
    });