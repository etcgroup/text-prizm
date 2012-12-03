define(['jquery', 'common/helpers/bootstrap'], function($, BootstrapHelper) {
    describe("BootstrapHelper", function() {

        it("can render a normal icon", function() {
            var icon_name = 'my-icon';
            var icon = $(BootstrapHelper.icon(icon_name));

            expect(icon).toBe('i.icon-' + icon_name);
            expect(icon).not.toBe('i.icon-white');
        });

        it("can render a white icon", function() {
            var icon_name = 'my-icon';
            var icon = $(BootstrapHelper.icon_white(icon_name));

            expect(icon).toBe('i.icon-' + icon_name);
            expect(icon).toBe('i.icon-white');
        });

        it ("can render a progress bar", function() {
            var percentage = 0.25;
            var classes = "extra-class";
            var id = "my-id";

            var bar = $(BootstrapHelper.progress_bar(percentage, classes, id));

            expect(bar).toBe('.progress');
            expect(bar).toContain('.bar');
            expect(bar.find('.bar')).toHaveCss({
                width: '25%'
            });
        });

    });
});
