define([
    'underscore',
    './datetimes',
    './entitylinks',
    './numbers',
    './strings',
    './bootstrap'
    ], function(_, DateTimeHelper, EntityLinkHelper, NumberHelper, StringHelper, BootstrapHelper) {

        /**
         * Pull together all of the helpers
         */
        var Helpers = {};

        return _.extend(Helpers,
            DateTimeHelper,
            EntityLinkHelper,
            NumberHelper,
            StringHelper,
            BootstrapHelper);
    });
