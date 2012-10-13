define(['lib/backbone-relational', 'models/code_model'], function(Backbone, Code) {

    var CodeCollection = Backbone.Collection.extend({
        model: Code,
        comparator: function(code){
            return code.get("name");
        }
    });
    return CodeCollection;
});