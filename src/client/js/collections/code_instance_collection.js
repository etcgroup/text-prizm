define(['jquery', 'backbone', 'lib/date', 'models/code_instance_model'],
    function($, Backbone, Date, CodeInstance) {

        var CodeInstanceCollection = Backbone.Collection.extend({
            model: CodeInstance,

            fetch: function(options) {
                var self = this;

                var startQuery = new Date();
                $.get('api/coding/instances_for', options.data, 'json')
                .done(function(instances) {

                    var stopQuery = new Date();

                    console.log('Time to get code instances: ' + ((stopQuery.getTime() - startQuery.getTime())/1000.0) + ' seconds');

                    startQuery = new Date();

                    self.reset(instances);

                    stopQuery = new Date();
                    console.log('Time to process code instances: ' + ((stopQuery.getTime() - startQuery.getTime())/1000.0) + ' seconds');

                    if (options.success)
                        options.success();
                })
                .fail(function() {
                    console.log("failure");
                    if (options.error)
                        options.error();
                });
            }
        });
        return CodeInstanceCollection;
    });