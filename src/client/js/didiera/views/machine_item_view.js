define(['marionette',
    'text!../templates/machine_item.html'],
    function(Marionette, machineItemTemplate) {

        /**
         * A view that summarizes a machine.
         */
        var MachineItemView = Marionette.ItemView.extend({
            template: machineItemTemplate,
            tagName: 'li',
            className: 'machine'
        });

        return MachineItemView;
    });