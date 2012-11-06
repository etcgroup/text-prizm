define(['underscore'], function(_) {

    var templates = {
        hover_full: '<span title="<%=full%>"><%=summary%></span>'
    }

    //Compile the template strings
    for (var name in templates) {
        templates[name] = _.template(templates[name]);
    }

    /**
     * Helper for number formatting.
     */
    var NumberHelper = {

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
    }

    return NumberHelper;
});