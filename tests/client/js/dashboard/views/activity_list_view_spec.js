define([
    'backbone',
    'dashboard/views/activity_list_view'
], function(Backbone, ActivityListView) {

    describe("ActivityListView", function() {

        beforeEach(function() {
            this.collection = new Backbone.Collection();

            this.target = $('<div id="target">');

            this.view = new ActivityListView({
                collection: this.collection
            });

            $('body').append(this.target);
        });

        afterEach(function() {
            this.view.remove();
            this.target.remove();
        });

        it('is backed by the provided collection', function() {
            expect(this.view.collection).toBe(this.collection);
        });

        it('returns itself on render', function() {
            expect(this.view.render()).toBe(this.view);
        });

        it('contains a panel header', function() {
            expect(this.view.render().$el).toContain('.header');
        });

        it('contains a panel body', function() {
            expect(this.view.render().$el).toContain('.body');
        });

        it('contains a ul element', function() {
            expect(this.view.$el).toContain('ul');
        });

        it('displays a message when the list is empty', function() {
            expect(this.view.render().$el.html()).toContain("No recent activity to display");
        });

        it('displays the correct number of activities', function() {

            //The collection now contains 2 models
            this.collection.reset([{}, {}]);

            expect(this.view.render().$el.find('li').size()).toBe(2);
        });

//        it('contains the correct type of ')
    });

});