define(['marionette',
    '../views/machine_item_view'],
    function(Marionette, MachineItemView) {

        /**
         * A view that lists machines.
         */
        var MachineListView = Marionette.CompositeView.extend({
            template: "I'm a machine list <ul></ul>",
            itemView: MachineItemView,
            itemViewContainer: 'ul'
        });

        return MachineListView;
    });