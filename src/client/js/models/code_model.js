define(['backbone', 'lib/backbone-relational'], function(Backbone) {
    var Code = Backbone.RelationalModel.extend({
        url: 'api/coding/code'
    });
    return Code;
});
