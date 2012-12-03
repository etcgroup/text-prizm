define(['underscore'], function(_) {

    var templates = {
        icon: '<i class="icon-<%=name%> <%=white%>"></i>',
        progress: '<div class="progress <%=classes%>"><div class="bar" style="width: <%=percent%>%;"></div></div>'
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
        },

        /**
         * Gets HTML to display a progress bar.
         *
         * @param percentage The percent complete, fraction out of 1.
         * @param classes Any additional classes (besides "progress").
         * @param id An optional id attribute.
         */
        progress_bar: function(percentage, classes, id) {
            return templates.progress({
                percent: Math.round(100 * percentage),
                classes: classes,
                id: id
            });
        }
    };

    return BootstrapHelper;
});
