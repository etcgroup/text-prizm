define(['jquery', 'common/helpers/entitylinks'], function($, EntityLinkHelper) {
    describe("EntityLinkHelper", function() {

        beforeEach(function() {

            this.user_data = {
                id: 3,
                name: 'myusername',
                full_name: 'My Name'
            };

            this.code_data = {
                id: 3,
                name: 'code',
                description: 'code description'
            };

            this.memo_data = {
                id: 4,
                summary: 'this is a memo with a very very long description blah blah blah'
            };

        });
        it("can link to a user", function() {


            var link = $(EntityLinkHelper.user_name_link(this.user_data));

            expect(link).toBe('a');
            expect(link.attr('title')).toBe(this.user_data.name);
            expect(link.attr('href')).toBe('users/' + this.user_data.id);
            expect(link.text()).toBe(this.user_data.full_name);
        });

        it("can link to a code", function() {

            var link = $(EntityLinkHelper.code_name_link(this.code_data));

            expect(link).toBe('a.label');
            expect(link.attr('title')).toBe(this.code_data.description);
            expect(link.attr('href')).toBe('codes/' + this.code_data.id);
            expect(link.text()).toBe(this.code_data.name);
        });

        it("can build a url to a message cluster", function() {
            var cluster_id = 134;

            var url = EntityLinkHelper.messages_ref(cluster_id);

            expect(typeof url).toBe('string');
            expect(url).toMatch(cluster_id);
        });

        it("can link to a memo", function() {

            var link = $(EntityLinkHelper.memo_summary_link(this.memo_data));

            expect(link).toBe('a');
            expect(link.attr('title')).toBe(this.memo_data.summary);
            expect(link.attr('href')).toBe('memos/' + this.memo_data.id);
            expect(link.text()).toMatch(/\.\.\./);
        });

        it("can link to a memo's target", function() {
            this.memo_data.target_type = 'code';
            this.memo_data.target = this.code_data;

            var target_link_html = EntityLinkHelper.memo_target_link(this.memo_data);
            var code_link_html = EntityLinkHelper.code_name_link(this.code_data);

            expect(target_link_html).toBe(code_link_html);
        });
    });
});
