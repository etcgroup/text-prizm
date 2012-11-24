define(['backbone'], function(Backbone) {
    /**
     * Model for storing the app status.
     */
    var AppStatus = Backbone.Model.extend({
        url: 'ext/app_status/summary',
        defaults: {
            app_name: 'App',
            build_version: '0',
            build_revision: '',
            build_time: 0,
            repo_url: '',
            upgrade_time: 0,
            database_host: 'localhost',
            database_schema: '',
            database_migration: 0
        }
    });
    return AppStatus;
});
