define(['moment', 'underscore'], function(moment, _) {

    var templates = {
        time_ago: '<span title="<%= full_time %>"><%= time_ago %></span>'
    };

    //Compile the template strings
    for (var name in templates) {
        templates[name] = _.template(templates[name]);
    }

    //Tracks whether the DateTimeHelper functions will be outputing UTC or Local time.
    var _output_utc = false;

    /**
     * Helper for date and time formatting.
     */
    var DateTimeHelper = {
        output_utc: function() {
            _output_utc = true;
        },

        output_local: function() {
            _output_utc = false;
        },

        /**
         * Given a timestamp, returns a long formatted
         * date-time with month, day, year, hour, minute, and second.
         */
        long_date_time: function(timestamp) {
            var date = moment.unix(timestamp);
            if (_output_utc) {
                date.utc();
            }
            return date.format('MMMM Do YYYY, h:mm:ss a');
        },

        /**
         * Given a timestamp, returns a medium formatted
         * date-time with month, day, year, hour, and minute.
         */
        medium_date_time: function(timestamp) {
            var date = moment.unix(timestamp);
            if (_output_utc) {
                date.utc();
            }
            return date.format('MMM D YYYY, h:mm a');
        },

        /**
         * Given a timestamp, creates a time-ago string for it.
         */
        time_ago: function(timestamp) {
            return templates.time_ago({
                time_ago: moment.unix(timestamp).from(moment()),
                full_time: this.long_date_time(timestamp)
            });
        }
    };

    return DateTimeHelper;
});