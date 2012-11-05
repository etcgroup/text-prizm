define(['moment', 'underscore'], function(moment, _) {

    var templates = {
        hover_full: _.template('<span title="<%=full%>"><%=summary%></span>')
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
        }
    };

    return Helpers;
});
