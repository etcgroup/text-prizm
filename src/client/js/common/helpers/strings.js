define(['underscore'], function(_) {

    var templates = {
        user_name_link: '<a href="users/<%=name%>" title="<%=name%>"><%=full_name%></a>',
        code_name_link: '<a class="label" href="codes/<%=name%>" title="<%=description%>"><%=name%></a>',
        memo_summary_link: '<a href="memos/<%=id%>" title="<%=long_summary%>"><%=short_summary%></a>',
        error: '<span class="label label-error"><%=message%></span>'
    };

    //Compile the template strings
    for (var name in templates) {
        templates[name] = _.template(templates[name]);
    }

    /**
     * Helper for formatting strings.
     */
    var StringHelper = {

        /**
         * Given a git long hash, returns a short hash (the first 8 characters).
         */
        git_short_hash: function(long_hash) {
            return long_hash.toString().slice(0, 8);
        },

        /**
         * Shortens the given string to at most max_length.
         * Tries to cut on word boundaries.
         * Adds ellipses.
         *
         * Based on http://snipplr.com/view/40259/
         */
        short_string: function(string, max_length) {
            if (string.length <= max_length) {
                return string;
            }

            var xMaxFit = max_length - 3;
            var xTruncateAt = string.lastIndexOf(' ', xMaxFit);
            if (xTruncateAt === -1 || xTruncateAt < max_length / 2) {
                xTruncateAt = xMaxFit;
            }

            return string.substr(0, xTruncateAt) + "...";
        }
    };

    return StringHelper;
});