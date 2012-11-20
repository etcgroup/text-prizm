define([
    'backbone',
    'dashboard/views/app_status_view'
    ], function(Backbone, AppStatusView) {

        describe("AppStatusView", function() {

            beforeEach(function() {
                this.model = new Backbone.Model({
                    app_name: 'AppName',
                    build_version: '0',
                    build_revision: '',
                    build_time: 0,
                    repo_url: '',
                    upgrade_time: 0,
                    database_host: 'localhost',
                    database_schema: '',
                    database_migration: 0
                });

                this.view = new AppStatusView({
                    model: this.model
                });
            });

            afterEach(function() {
                });

            it('is backed by the provided model', function() {
                expect(this.view.model).toBe(this.model);
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

            it('contains the app name', function() {
                expect(this.view.render().$el.text()).toMatch(this.model.get('app_name'));
            });

            it('re-renders when the model changes', function() {
                expect(this.view.render().$el.text()).toMatch(this.model.get('app_name'));

                var new_name = 'New App Name';

                //This should trigger the update
                this.model.set({
                    'app_name': new_name
                });

                expect(this.view.$el.text()).toMatch(new_name);
            });

        });

    });