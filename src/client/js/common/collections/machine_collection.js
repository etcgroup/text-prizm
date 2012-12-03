define(['backbone', '../models/machine'], function(Backbone, Machine) {

    var MachineCollection = Backbone.Collection.extend({
        url: 'didi/comp/machines?limit=10',
        model: Machine
    });
    return MachineCollection;
});
