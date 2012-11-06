define(['moment', 'underscore'], function(moment, _) {

    var templates = {
        hover_full: '<span title="<%=full%>"><%=summary%></span>',
        user_name_link: '<a href="users/<%=name%>" title="<%=name%>"><%=full_name%></a>',
        code_name_link: '<a class="label" href="codes/<%=name%>" title="<%=description%>"><%=name%></a>',
        icon: '<i class="icon-<%=name%> <%=white%>"></i>',
        time_ago: '<span title="<%= full_time %>"><%= time_ago %></span>',
        memo_summary_link: '<a href="memos/<%=id%>" title="<%=long_summary%>"><%=short_summary%></a>'
    }

    //Compile the template strings
    for (name in templates) {
        templates[name] = _.template(templates[name]);
    }

    var Helpers = {
        /**
         * Given a git long hash, returns a short hash (the first 8 characters).
         */
        git_short_hash: function(long_hash) {
            return long_hash.toString().slice(0, 8);
        },

        /**
         * Given a timestamp, returns a long formatted
         * date-time with month, day, year, hour, minute, and second.
         */
        long_date_time: function(timestamp) {
            var date = moment.unix(timestamp);
            return date.format('MMMM Do YYYY, h:mm:ss a');
        },

        /**
         * Given a timestamp, returns a medium formatted
         * date-time with month, day, year, hour, and minute.
         */
        medium_date_time: function(timestamp) {
            var date = moment.unix(timestamp);
            return date.format('MMM Do YYYY, h:mm a');
        },

        /**
         * Given a timestamp, creates a time-ago string for it.
         */
        time_ago: function(timestamp) {
            return templates.time_ago({
                time_ago: moment.unix(timestamp).from(moment()),
                full_time: this.long_date_time(timestamp)
            });
        },

        /**
         * Returns the percent that the part is of the whole.
         */
        percent_of: function(part, whole) {
            return Math.round(100 * part / whole)
        },

        /**
         * Inserts commas at the appropriate positions in the provided number.
         *
         * 1255433.2534 => 1,255,433.2534
         * based on http://stackoverflow.com/questions/2901102/how-to-print-number-with-commas-as-thousands-separators-in-javascript
         */
        add_commas: function(number) {
            var parts = number.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return parts.join('.');
        },

        /**
         * Produces an approximate representation of the number. The original
         * number will be available on hover.
         * Large values are truncated (23000 => 23k) and commas are added.
         */
        approx_num: function(number) {
            var short_value = number.toString();
            var full_value = number.toString();

            if (number >= 10000) {
                short_value = this.add_commas(Math.round(number / 1000)) + 'k';
                full_value = this.add_commas(full_value);
            } else {
                short_value = Math.round(number).toString();;
            }

            if (full_value !== short_value) {
                return templates.hover_full({
                    summary: short_value,
                    full: full_value
                });
            } else {
                return full_value;
            }
        },

        /**
         * Given a user model, creates a link to the user's page
         * with the name as content.
         */
        user_name_link: function(user_model) {
            return templates.user_name_link(user_model.toJSON());
        },

        /**
         * Given a code model, creates a link to the page about the code.
         */
        code_name_link: function(code_model) {
            return templates.code_name_link(code_model.toJSON());
        },

        /**
         * Get the url to view the given message cluster.
         */
        messages_ref: function(cluster_id) {
            return 'messages/cluster/' + cluster_id;
        },

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
        },

        /**
         * Shortens the given string to at most max_length.
         * Tries to cut on word boundaries.
         * Adds ellipses.
         *
         * Based on http://snipplr.com/view/40259/
         */
        short_string: function(string, max_length) {
            if (string.length <= max_length)
                return string;

            var xMaxFit = max_length - 3;
            var xTruncateAt = string.lastIndexOf(' ', xMaxFit);
            if (xTruncateAt == -1 || xTruncateAt < max_length / 2)
                xTruncateAt = maxFit;

            return string.substr(0, xTruncateAt) + "...";
        },

        /**
         * Creates a link to the memo using the summary as content.
         */
        memo_summary_link: function(memo_model) {
            var summary = memo_model.get('summary');
            var short_summary = this.short_string(summary, 25);

            return templates.memo_summary_link({
                id: memo_model.get('id'),
                short_summary: short_summary,
                long_summary: summary
            });
        },

        /**
         * Creates an appropriate link to the memo's target.
         */
        memo_target_link: function(memo_model) {
            switch(memo_model.get('target_type')) {
                case 'code':
                    return this.code_name_link(memo_model.get('target'));
                    break;
                default:
                    return templates.error({
                        message: 'unknown target type'
                    });
            }
        }
    };

    return Helpers;
});
