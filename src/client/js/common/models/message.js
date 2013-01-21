define(['backbone', 'models/participant_model', 'models/code_instance_model', 'lib/backbone-relational'],
    function(Backbone, CodeInstance, Participant) {

        var Message = Backbone.RelationalModel.extend({
            relations: [{
                type: Backbone.HasOne,
                key: 'participant',
                relatedModel: Participant
            }, {
                type: Backbone.HasMany,
                key: 'instances',
                relatedModel: CodeInstance
            }]
        });
        return Message;
    });