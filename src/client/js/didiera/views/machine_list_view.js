define(['marionette',
    '../views/machine_item_view',
    'common/views/spinner_view',
    'text!../templates/machine_list.html'],
    function(Marionette, MachineItemView, SpinnerView, machineListTemplate) {

        /**
         * A view that is shown when there are no machines.
         */
        var EmptyMachineListView = SpinnerView.extend({
            tagName: 'li',
            message: 'No machines currently registered...'
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
