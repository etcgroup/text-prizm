define([
    'backbone',
    'dashboard/views/activity_list_view'
    ], function(Backbone, ActivityListView) {

        describe("ActivityListView", function() {

            beforeEach(function() {
                this.collection = new Backbone.Collection();
                this.view = new ActivityListView({
                    collection: this.collection
                });
            });

            afterEach(function() {
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
                expect(this.view.render().$el).toContain('ul');
            });

            it('displays a message when the list is empty', function() {
                expect(this.view.render().$el.html()).toContain("No recent activity to display");
            });

            it('displays the correct number of activities', function() {

                //By default the view contains an empty item view
                expect(this.view.render().$el.find('li').size()).toBe(1);

                //The collection now contains more models
                this.collection.reset([{}, {}, {}]);
                expect(this.view.render().$el.find('li').size()).toBe(3);
            });
        });

    });