define(['underscore'], function(_) {

    var templates = {
        user_name_link: '<a href="users/<%=id%>" title="<%=name%>"><%=full_name%></a>',
        code_name_link: '<a class="label" href="codes/<%=id%>" title="<%=description%>"><%=name%></a>',
        memo_summary_link: '<a href="memos/<%=id%>" title="<%=long_summary%>"><%=short_summary%></a>',
        error: '<span class="label label-warning"><%=message%></span>'
    };

    //Compile the template strings
    for (var name in templates) {
        templates[name] = _.template(templates[name]);
    }

    /**
     * Helper for formatting links to entities.
     */
    var EntityLinkHelper = {

        /**
         * Given a user data object, creates a link to the user's page
         * with the name as content.
         */
        user_name_link: function(user_data) {
            return templates.user_name_link(user_data);
        },

        /**
         * Given a code data object, creates a link to the page about the code.
         */
        code_name_link: function(code_data) {
            return templates.code_name_link(code_data);
        },

        /**
         * Get the url to view the given message cluster.
         */
        messages_ref: function(cluster_id) {
            return 'messages/cluster/' + cluster_id;
        },

        /**
         * Given a memo data object, creates a link to the memo using the summary as content.
         */
        memo_summary_link: function(memo_data) {
            _.defaults(memo_data, { summary: '' });

            var summary = memo_data.summary;
            var short_summary = this.short_string(summary, 25);

            return templates.memo_summary_link({
                id: memo_data.id,
                short_summary: short_summary,
                long_summary: summary
            });
        },

        /**
         * Given a memo data object, creates an appropriate link to the memo's target.
         */
        memo_target_link: function(memo_data) {
            switch(memo_data.target_type) {
                case 'code':
                    return this.code_name_link(memo_data.target);
                default:
                    return templates.error({
                        message: 'unknown target type'
                    });
            }
        }
    };

    return EntityLinkHelper;
});