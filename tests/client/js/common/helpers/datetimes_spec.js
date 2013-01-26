define(['common/helpers/datetimes', 'moment', 'jquery'], function(DateTimeHelper, moment, $) {
    describe("DateTimeHelper", function() {

        afterEach(function() {
            //Restore the local time output setting
            DateTimeHelper.output_local();
        });

        it("can convert timestamps into medium human-readable datetimes", function() {
            var timestamp = 1353274908;
            var medium_datetime = 'Nov 18 2012, 9:41 pm';
            var medium_epoch = 'Jan 1 1970, 12:00 am';

            DateTimeHelper.output_utc();

            expect(DateTimeHelper.medium_date_time(timestamp)).toBe(medium_datetime);
            expect(DateTimeHelper.medium_date_time(0)).toBe(medium_epoch);
        });

        it("can convert timestamps into long human-readable datetimes", function() {
            var timestamp = 1353274908;
            var long_datetime = 'November 18th 2012, 9:41:48 pm';
            var long_epoch = 'January 1st 1970, 12:00:00 am';

            DateTimeHelper.output_utc();

            expect(DateTimeHelper.long_date_time(timestamp)).toBe(long_datetime);
            expect(DateTimeHelper.long_date_time(0)).toBe(long_epoch);
        });

        it("can convert timestamps into long human-readable times", function() {
            var timestamp = 1353274908;
            var long_datetime = '9:41:48 pm';
            var long_epoch = '12:00:00 am';

            DateTimeHelper.output_utc();

            expect(DateTimeHelper.long_time(timestamp)).toBe(long_datetime);
            expect(DateTimeHelper.long_time(0)).toBe(long_epoch);
        });

        it("can convert timestamps into MySQL datetimes", function() {
            var timestamp = 1353274908;
            var mysql_datetime = '2012-11-18 21:41:48';
            var mysql_epoch = '1970-01-01 00:00:00';

            DateTimeHelper.output_utc();

            expect(DateTimeHelper.mysql_date_time(timestamp)).toBe(mysql_datetime);
            expect(DateTimeHelper.mysql_date_time(0)).toBe(mysql_epoch);
        });

        it("can express how long ago a timestamp was in addition to the full time", function() {

            var now = moment();
            var before = moment(now);
            before.subtract('minutes', 3);
            var before_ts = before.unix();

            var label = $(DateTimeHelper.time_ago(before_ts));

            expect(label).toBe('span');
            expect(label.attr('title')).toBe(DateTimeHelper.long_date_time(before_ts));
            expect(label.text()).toBe(before.from(moment()));
        });
    });
});