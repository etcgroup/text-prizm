define(['marionette',
    'common/helpers/all',
    'text!../templates/machine_item.html'],
    function(Marionette, Helpers, machineItemTemplate) {

        /**
         * A view that summarizes a machine.
         */
        var MachineItemView = Marionette.ItemView.extend({
            template: machineItemTemplate,
            templateHelpers: Helpers,
            tagName: 'li',
            className: 'machine'
        });

        return MachineItemView;
    });