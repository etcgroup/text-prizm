define(['jquery', 'common/helpers/strings'], function($, StringHelper) {
    describe("StringHelper", function() {

        it("can shorten git hashes to 8 characters", function() {
            var long_hash = '5161e6c2e8666398b1ebae01a6a35492c45bfc78';
            var short_hash = '5161e6c2';

            expect(StringHelper.git_short_hash(long_hash)).toBe(short_hash);
            expect(StringHelper.git_short_hash(short_hash)).toBe(short_hash);
            expect(StringHelper.git_short_hash("")).toBe("");
        });

        it("can shorten a long string with ellipses", function() {
            //Length = 28
            var long_string = "I am a very very long string";

            //The max length is very large
            expect(StringHelper.short_string(long_string, 200)).toBe(long_string);

            //Cut off the last word
            expect(StringHelper.short_string(long_string, 27)).toBe("I am a very very long...");

            //Check the boundaries
            expect(StringHelper.short_string(long_string, 8)).toBe("I am...");
            expect(StringHelper.short_string(long_string, 9)).toBe("I am a...");
        });

        it('can show full text on hover', function() {
            var summary = 'i am a summary';
            var full = 'I am not a summary, but am the full text.';

            var element = $(StringHelper.hover_full(summary, full));

            expect(element).toBe('span');
            expect(element.attr('title')).toBe(full);
            expect(element.text()).toBe(summary);
        });

        it('can trim whitespace from a string', function() {
            expect(StringHelper.trim("asdf")).toBe("asdf");
            expect(StringHelper.trim(" asdf")).toBe("asdf");
            expect(StringHelper.trim("asdf ")).toBe("asdf");
            expect(StringHelper.trim("\n\t\tasdf   asdf \t")).toBe("asdf   asdf");
        });

        it('can detect invalid json', function() {
            expect(StringHelper.get_json_error('{}')).toBeNull();
            expect(StringHelper.get_json_error('{}f')).toBeTruthy();
        });
    });
});