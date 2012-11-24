define([
    'common/models/activity',
    'dashboard/views/activity_item_view'
    ], function(Activity, ActivityItemView) {

        describe("ActivityItemView", function() {

            //Example code data
            var code_data = {
                id: 52,
                name: 'code',
                description: 'code desc'
            };

            //Example user data
            var user_data = {
                id: 43,
                name: 'username',
                full_name: 'User Name'
            }

            //Example memo data
            var memo_data = {
                id: 52,
                target_type: 'code',
                target: code_data
            }

            var sampleActivityIdIncrement = 10;
            var sampleActivity = function(activity_type, user, ref_obj, json_data) {
                return {
                    id: sampleActivityIdIncrement++,
                    activity_type: activity_type,
                    time: 1353356494,
                    user: user,
                    json_data: json_data,
                    ref_obj: ref_obj
                }
            }

            var activityItems = [];

            //Generate example activity data
            activityItems.push(sampleActivity('apply-codes', user_data, null, {
                number: 234,
                cluster_id: 12
            }));
            activityItems.push(sampleActivity('create-code', user_data, code_data));
            activityItems.push(sampleActivity('update-code', user_data, code_data));
            activityItems.push(sampleActivity('create-memo', user_data, memo_data));
            activityItems.push(sampleActivity('update-memo', user_data, memo_data));


            beforeEach(function() {
                this.model = new Activity();
                this.model.set(activityItems[0]);

                this.view = new ActivityItemView({
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

            it('renders the proper tag and class', function() {
                expect(this.view.render().$el).toBe('li.activity');
            });

            it('contains an activity body', function() {
                expect(this.view.render().$el).toContain('.activity-body');
            });

            it('contains an activity date', function() {
                expect(this.view.render().$el).toContain('.activity-date');
            });

            it ('knows a sub-template for each activity type', function() {
                var lastTemplate = null;
                var self = this;
                _.each(activityItems, function(itemData) {

                    self.model.set(itemData);
                    var currentTemplate = self.view.getActivityTemplate();

                    expect(currentTemplate).toBeTruthy();
                    expect(currentTemplate).not.toBe(lastTemplate);

                    lastTemplate = currentTemplate;
                });
            });

            it('prepares data for rendering', function() {
                var data = this.view.serializeData();

                expect(data.activity_body).toBeDefined();
                expect(data.id).toBe(this.model.get('id'));
            });
        });
    });