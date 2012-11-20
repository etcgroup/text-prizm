define([
    'common/models/app_status',
    'dashboard/views/app_status_view'
    ], function(AppStatus, AppStatusView) {

        describe("AppStatusView", function() {

            beforeEach(function() {
                this.model = new AppStatus();
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

            it('displays a spinner before model changed', function() {
                this.view.render();
                expect(this.view.$el).not.toContain('.header');
                expect(this.view.$el).toContain('.spinner');
            });

            it('does not display a spinner after model changed', function() {
                this.model.trigger('change');
                this.view.render();
                expect(this.view.$el).not.toContain('.spinner');
            });

            it('contains a panel header, body, and app name after model changed', function() {
                this.model.trigger('change');
                this.view.render();
                expect(this.view.render().$el).toContain('.header');
                expect(this.view.render().$el).toContain('.body');
                expect(this.view.$el.text()).toMatch(this.model.get('app_name'));
            });

            it('renders on model change', function() {
                spyOn(this.view, 'render');
                this.model.trigger('change');
                expect(this.view.render).toHaveBeenCalled();
            });

        });

    });