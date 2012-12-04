define(["backbone",
    "marionette",
    "common/views/alert_box"],
    function(Backbone, Marionette, AlertBox) {

        /**
         * The text prizm application
         */
        var TextPrizm = new Marionette.Application();

        TextPrizm.addRegions({
            alertRegion: '#alert-box'
        });

        TextPrizm.addInitializer(function() {
            //Set up the alert box
            var alertBox = new AlertBox({
                displayInterval: 4000 // seconds
            });
            this.alertRegion.show(alertBox);

            //Create a handler for alerts
            this.success = function(message) {
                alertBox.setMessage(message, 'label-success');
            }

            this.warning = function(message) {
                alertBox.setMessage(message, 'label-warning')
            }

            this.error = function(message) {
                alertBox.setMessage(message, 'label-important')
            }
        });

        TextPrizm.on("initialize:after", function(options){
            if (Backbone.history){
                Backbone.history.start();
            }
        });

        return TextPrizm;
    });
