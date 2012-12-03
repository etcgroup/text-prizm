define(['backbone', 'lib/backbone-relational'], function(Backbone) {
    /**
     * Model for storing a machine.
     */
    var Machine = Backbone.RelationalModel.extend({
        url: 'didi/comp/machine',

        defaults: {
            name: "HAL-9000",
            ip: "0.0.0.0",
            port: "0",
            last_ping: 0,
            current_task: null
        }
    });
    return Machine;
});
