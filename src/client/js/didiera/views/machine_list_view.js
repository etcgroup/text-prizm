define(['marionette',
    '../views/machine_item_view',
    'text!../templates/machine_list.html'],
    function(Marionette, MachineItemView, machineListTemplate) {

        /**
         * A view that is shown when there are no machines.
         */
        var EmptyMachineListView = Marionette.ItemView.extend({
            template: "No machines currently registered.",
            tagName: 'li'
        });

        /**
         * A view that lists machines.
         */
        var MachineListView = Marionette.CompositeView.extend({
            template: machineListTemplate,
            itemView: MachineItemView,
            itemViewContainer: 'ul',
            emptyView: EmptyMachineListView
        });

        return MachineListView;
    });
    