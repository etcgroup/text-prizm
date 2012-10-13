define(['lib/backbone-relational', 'models/user_model'],
    function(Backbone, User) {

        var Task = Backbone.RelationalModel.extend({
            url: 'api/gen/task',
            relations: [
            {
                type: Backbone.HasOne,
                key: 'assignee',
                keySource: 'assignee_id',
                relatedModel: User,
                includeInJSON: 'id',
                reverseRelation: {
                    key: 'assigned_tasks',
                    includeInJSON: 'id'
                }
            },
            {
                type: Backbone.HasOne,
                key: 'creator',
                keySource: 'creator_id',
                relatedModel: User,
                includeInJSON: 'id',
                reverseRelation: {
                    key: 'created_tasks',
                    includeInJSON: 'id'
                }
            }
            ]
        });
    });