define(['backbone', 'lib/backbone-relational'], function(Backbone) {
    /**
     * Model for storing a machine.
     */
    var Machine = Backbone.RelationalModel.extend({
        url: 'didi/comp/machine'
    });
    return Machine;
});
