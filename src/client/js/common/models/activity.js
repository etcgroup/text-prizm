define(['backbone', 'models/user_model', 'lib/backbone-relational'], function(Backbone, User) {
    /**
     * Model for storing activities.
     */
    var Activity = Backbone.RelationalModel.extend({
        url: 'rest/activities/activity',
        relations: [
        {
            type: Backbone.HasOne,
            key: 'user',
            relatedModel: User
        }
        ],

        parse: function(response, xhr) {
            if (typeof response.json_data == "string") {
                // Parse the custom json_data field
                response.json_data = JSON.parse(response.json_data);
            }
            return response;
        }
    });
    return Activity;
});
