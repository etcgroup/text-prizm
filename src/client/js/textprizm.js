define(["backbone",
    "marionette"],
    function(Backbone, Marionette) {

        /**
         * The text prizm application
         */
        var TextPrizm = new Marionette.Application();

        TextPrizm.on("initialize:after", function(options){
            if (Backbone.history){
                Backbone.history.start();
            }
        });

        return TextPrizm;
    });
