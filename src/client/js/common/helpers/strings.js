define(['underscore'], function(_) {

    var templates = {
        user_name_link: '<a href="users/<%=name%>" title="<%=name%>"><%=full_name%></a>',
        code_name_link: '<a class="label" href="codes/<%=name%>" title="<%=description%>"><%=name%></a>',
        memo_summary_link: '<a href="memos/<%=id%>" title="<%=long_summary%>"><%=short_summary%></a>',
        error: '<span class="label label-error"><%=message%></span>',
        hover_full: '<span title="<%=full%>"><%=summary%></span>'
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
        },

        /**
         * Creates a span containing the summary text while showing
         * the full text on hover.
         */
        hover_full: function(summary, full) {
            return templates.hover_full({
                summary: summary,
                full: full
            });
        },

        /**
         * Concatenates the list of items with a
         * separator (defaults to ','). The final item
         * will be preceded by "and".
         */
        entity_list: function(list, separator) {
            separator = separator || ',';

            var result = '';
            _.each(list, function(item, index) {
                if (index > 0) {
                    result += ' ';
                }

                result += item;

                if (list.length > 2 && index < list.length - 1) {
                    result += separator;
                }

                if (list.length > 1 && index === list.length - 2) {
                    result += ' and';
                }
            });

            return result;
        }
    };

    return StringHelper;
});