define(['marionette'],
    function(Marionette) {

        /**
         * A view that summarizes a machine.
         */
        var MachineItemView = Marionette.ItemView.extend({
            template: "I'm a machine",
            tagName: 'li',
            className: 'machine'
        });

        return MachineItemView;
    });