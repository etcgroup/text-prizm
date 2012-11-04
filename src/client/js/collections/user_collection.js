define(['backbone', 'models/user_model'], function(Backbone, User) {

    var UserCollection = Backbone.Collection.extend({
        model: User
    });
    return UserCollection;
});