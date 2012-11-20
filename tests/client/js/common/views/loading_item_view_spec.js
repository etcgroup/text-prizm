define([
    'backbone',
    'common/views/loading_item_view'
    ], function(Backbone, LoadingItemView) {

        describe("LoadingItemView", function() {

            var TestView = LoadingItemView.extend({
                onModelChange: function() {
                    this.modelWasChanged = true;
                },
                template: "<div class='test-view'></div>"
            });

            beforeEach(function() {
                this.model = new Backbone.Model();
                this.view = new TestView({
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

            it('knows which template to use', function() {
                expect(this.view.getTemplate()).not.toBe(this.view.template);

                this.model.trigger('change');

                expect(this.view.getTemplate()).toBe(this.view.template);
            });

            it('renders the spinner before model changed', function() {
                //When we render before model changed, the spinner should be enabled
                this.view.render();
                expect(this.view.spinner).toBeDefined();
                expect(this.view.spinnerEnabled).toBe(true);
                expect(this.view.$el).toContain('.spinner');

                //It should still work even when rendering again
                this.view.render();
                expect(this.view.spinner).toBeDefined();
                expect(this.view.spinnerEnabled).toBe(true);
                expect(this.view.$el).toContain('.spinner');
            });

            it('notifies on model change', function() {

                expect(this.view.modelWasChanged).toBeUndefined();

                this.model.trigger('change');

                expect(this.view.modelWasChanged).toBe(true);
            });

            it('hides the spinner after model changed', function() {

                //Make the spinner show
                this.view.render();

                this.model.trigger('change');

                this.view.render();
                //The spinner should still be defined, but stopped
                expect(this.view.spinner).toBeDefined();
                expect(this.view.spinnerEnabled).toBe(false);
                expect(this.view.$el).not.toContain('.spinner');

                this.view.render();
                //Same thing if we re-render
                expect(this.view.spinner).toBeDefined();
                expect(this.view.spinnerEnabled).toBe(false);
                expect(this.view.$el).not.toContain('.spinner');
            });

            it('renders the regular template after model changed', function() {
                this.model.trigger('change');

                //Now that the model has been set to something, it should render the real template
                this.view.render();
                expect(this.view.$el).toContain('.test-view');

                //And it should still work a second time
                this.view.render();
                expect(this.view.$el).toContain('.test-view');
            });

        });
    });