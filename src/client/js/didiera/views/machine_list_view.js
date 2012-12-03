define(['marionette',
    '../views/machine_item_view',
    'text!../templates/machine_list.html'],
    function(Marionette, MachineItemView, machineListTemplate) {

        /**
         * A view that lists machines.
         */
        var MachineListView = Marionette.CompositeView.extend({
            template: machineListTemplate,
            itemView: MachineItemView,
            itemViewContainer: 'ul'
        });

        return MachineListView;
    });