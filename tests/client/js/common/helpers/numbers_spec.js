define(['jquery', 'common/helpers/numbers'], function($, NumberHelper) {
    describe("NumberHelper", function() {

        it("calculates percentages correctly", function() {
            expect(NumberHelper.percent_of(35, 100)).toBe(35);
            expect(NumberHelper.percent_of(30, 200)).toBe(15);
            expect(NumberHelper.percent_of(0, 25823)).toBe(0);
            expect(NumberHelper.percent_of(25823, 25823)).toBe(100);
            expect(NumberHelper.percent_of(25823, 1)).toBe(2582300);
        });

        it("can insert commas into a number", function() {
            expect(NumberHelper.add_commas(0)).toBe('0');
            expect(NumberHelper.add_commas(0.4)).toBe('0.4');
            expect(NumberHelper.add_commas(999)).toBe('999');
            expect(NumberHelper.add_commas(1000)).toBe('1,000');
            expect(NumberHelper.add_commas(999000)).toBe('999,000');
            expect(NumberHelper.add_commas(1000000)).toBe('1,000,000');
            expect(NumberHelper.add_commas(1000000.4365)).toBe('1,000,000.4365');
        });

        it("can create an approximate representation of a number", function() {
            expect(NumberHelper.approx_num(0)).toBe('0');
            expect(NumberHelper.approx_num(0.4)).toBe('0');
            expect(NumberHelper.approx_num(999)).toBe('999');
            expect(NumberHelper.approx_num(1000)).toBe('1,000');
            expect(NumberHelper.approx_num(999000)).toBe('999k');
            expect(NumberHelper.approx_num(1000000)).toBe('1,000k');
            expect(NumberHelper.approx_num(1000000.4365)).toBe('1,000k');
        });

        it("can show approximation while preserving the full number", function() {
            expect($(NumberHelper.hover_approx(0))).toBe('span[title=""]:contains("0")');
            expect($(NumberHelper.hover_approx(0.4))).toBe('span[title="0.4"]:contains("0")');
            expect($(NumberHelper.hover_approx(999))).toBe('span[title=""]:contains("999")');
            expect($(NumberHelper.hover_approx(1000))).toBe('span[title=""]:contains("1,000")');
            expect($(NumberHelper.hover_approx(999000))).toBe('span[title="999,000"]:contains("999k")');
            expect($(NumberHelper.hover_approx(1000000))).toBe('span[title="1,000,000"]:contains("1,000k")');
            expect($(NumberHelper.hover_approx(1000000.4635))).toBe('span[title="1,000,000.4635"]:contains("1,000k")');
        });
    });
});
