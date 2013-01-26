define(function(require) {
    var Backbone = require('backbone'),
    Code = require('models/code_model'),
    User = require('models/user_model');
    require('lib/backbone-relational');

    var CodeInstance = Backbone.RelationalModel.extend({
        relations: [{
            type: Backbone.HasOne,
            key: 'code',
            relatedModel: Code
        }, {
            type: Backbone.HasOne,
            key: 'user23',
            keySource: 'user',
            relatedModel: User
        }],
        url: 'api/coding/instance'

    });
    return CodeInstance;
});
