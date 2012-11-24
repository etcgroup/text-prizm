define(['underscore', './strings'], function(_, StringHelper) {

    var templates = {
    };

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
            return Math.round(100 * part / whole);
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
         * Produces an approximate representation of the number (returns a string).
         * Values over 10000 are truncated (23000 => 23k) and commas are added.
         */
        approx_num: function(number) {
            if (number >= 10000) {
                return this.add_commas(Math.round(number / 1000)) + 'k';
            } else {
                return this.add_commas(Math.round(number));
            }
        },

        /**
         * Creates a summary of the number that shows the full value on hover,
         * if the number was actually summarized.
         */
        hover_approx: function(number) {
            var full = this.add_commas(number);
            var summary = this.approx_num(number);
            if (full !== summary) {
                return StringHelper.hover_full(summary, full);
            } else {
                return StringHelper.hover_full(full, '');
            }
        }
    };

    return NumberHelper;
});