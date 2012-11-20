define([
    'common/models/app_status',
    'dashboard/views/data_summary_view'
    ], function(AppStatus, DataSummaryView) {

        describe("DataSummaryView", function() {

            beforeEach(function() {
                this.model = new AppStatus();
                this.view = new DataSummaryView({
                    model: this.model
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

            it('displays a spinner before model changed', function() {
                this.view.render()
                expect(this.view.$el).not.toContain('table');
                expect(this.view.$el).toContain('.spinner');
            });

            it('does not display a spinner after model changed', function() {
                this.model.trigger('change');
                this.view.render();
                expect(this.view.$el).not.toContain('.spinner');
            });

            it('contains a panel header, body, and table after model changed', function() {
                this.model.trigger('change');
                this.view.render();
                expect(this.view.render().$el).toContain('.header');
                expect(this.view.render().$el).toContain('.body');
                expect(this.view.$el).toContain('table');
            });

            it('renders on model change', function() {
                expect(this.view.$el).toBeUndefined();
                this.model.trigger('change');
                expect(this.view.$el).not.toBeUndefined();
            });

        });

    });