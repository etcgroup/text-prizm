define(['backbone', 'models/participant_model', 'lib/backbone-relational'],
    function(Backbone, Participant) {

        var Message = Backbone.RelationalModel.extend({
            relations: [{
                type: Backbone.HasOne,
                key: 'participant',
                relatedModel: Participant
            }]
        });
        return Message;
    });