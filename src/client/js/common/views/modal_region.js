define(['marionette', 'lib/bootstrap'],
    function(Marionette) {

        /**
         * Based on
         * http://lostechies.com/derickbailey/2012/04/17/managing-a-modal-dialog-with-backbone-and-marionette/
         */
        var ModalRegion = Marionette.Region.extend({
            el: "#modal",

            constructor: function(){
                _.bindAll(this);
                Marionette.Region.prototype.constructor.apply(this, arguments);
                this.on("show", this.showModal, this);
            },

            showModal: function(view){
                view.on("close", this.hideModal, this);

                this.$el.modal('show');
                this.$el.on('hidden', this.close);
            },

            hideModal: function(){
                this.$el.modal('hide');
            }
        });
        return ModalRegion;
    });