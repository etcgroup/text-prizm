define(function(require) {
    var Backbone = require('backbone'),
    Code = require('models/code_model'),
    Message = require('models/message_model'),
    User = require('models/user_model');
    require('lib/backbone-relational');

    var CodeInstance = Backbone.RelationalModel.extend({
        relations: [{
            type: Backbone.HasOne,
            key: 'code',
            keySource: 'code_id',
            includeInJSON: 'id',
            relatedModel: Code,
            reverseRelation: {
                key: 'instances',
                includeInJSON: 'id'
            }
        }, {
            type: Backbone.HasOne,
            key: 'message',
            includeInJSON: 'id',
            keySource: 'message_id',
            relatedModel: Message,
            reverseRelation: {
                key: 'instances'
            }
        }, {
            type: Backbone.HasOne,
            key: 'user',
            keySource: 'user_id',
            relatedModel: User,
            includeInJSON: 'id',
            reverseRelation: {
                key: 'instances',
                includeInJSON: 'id'
            }
        }],
        url: 'api/coding/instance'

    });
    return CodeInstance;
});
