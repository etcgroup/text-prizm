define(['underscore'], function(_) {

    var templates = {
        icon: '<i class="icon-<%=name%> <%=white%>"></i>'
    };

    //Compile the template strings
    for (var name in templates) {
        templates[name] = _.template(templates[name]);
    }

    /**
     * Helper for Twitter Bootstrap-specific tasks.
     */
    var BootstrapHelper = {

        /**
         * Gets html to display the given icon.
         */
        icon: function(name) {
            return templates.icon({
                name: name,
                white: ''
            });
        },

        /**
         * Gets html to display the given icon in white.
         */
        icon_white: function(name) {
            return templates.icon({
                name: name,
                white: 'icon-white'
            });
        }
    };

    return BootstrapHelper;
});
