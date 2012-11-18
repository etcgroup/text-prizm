define(['common/helpers/datetimes', 'moment', 'jquery'], function(DateTimeHelper, moment, $) {
    describe("DateTimeHelper", function() {

        it("can convert timestamps into medium human-readable datetimes", function() {
            var timestamp = 1353274908;
            var medium_datetime = 'Nov 18 2012, 1:41 pm';
            var medium_epoch = 'Dec 31 1969, 4:00 pm';

            expect(DateTimeHelper.medium_date_time(timestamp)).toBe(medium_datetime);
            expect(DateTimeHelper.medium_date_time(0)).toBe(medium_epoch);
        });

        it("can convert timestamps into long human-readable datetimes", function() {
            var timestamp = 1353274908;
            var long_datetime = 'November 18th 2012, 1:41:48 pm';
            var long_epoch = 'December 31st 1969, 4:00:00 pm';

            expect(DateTimeHelper.long_date_time(timestamp)).toBe(long_datetime);
            expect(DateTimeHelper.long_date_time(0)).toBe(long_epoch);
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