define(['underscore'], function(_) {

    var templates = {
        icon: '<i class="icon-<%=name%> <%=white%>"></i>'
    }

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
        icon: function(name, use_white) {
            var white = '';
            if (use_white) {
                white = 'icon-white'
            }

            return templates.icon({
                name: name,
                white: white
            })
        }
    };

    return BootstrapHelper;
});
