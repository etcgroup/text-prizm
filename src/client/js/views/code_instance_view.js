define(['jquery', 'backbone', 'underscore'], function($, Backbone, _) {
    var CodeInstanceView = Backbone.View.extend({
        tagName: 'li',

        events: {
            'click .deleter': 'deleteClicked',
            'click .instance': 'clicked'
        },

        initialize: function() {
            this.model.view = this;
            this.model.on('change', this.render, this);
        },

        render: function() {
            this.$el.html(CodeInstanceView.template(this.model));
            return this;
        },


        deleteClicked: function(event) {
            event.stopPropagation();//don't want to trigger a flag if we fail to delete

            var idToDelete = this.model.get('id');
            this.model.destroy({
                wait: true,
                data: {
                    id: idToDelete
                },
                processData: true,
                success: function() {
                    console.log("Instance " + idToDelete + " deleted");
                },
                error: function() {
                    console.log("Instance " + idToDelete + " not deleted");
                    alert("Error deleting code on server. Try the following:\n1. Check your internet connection\n2. Reload the page\n3. Check your browser's error console (take a screenshot)");
                }
            });
        },

        clicked: function(event) {
            var idToChange = this.model.get('id');
            this.model.save({
                flag: 1 - this.model.get('flag')
            }, {
                success: function() {
                    console.log("Instance " + idToChange + " flag toggled");
                }
            });
        }
    }, {
        template: _.template($('#code-instance-template').html())
    });

    return CodeInstanceView;
});