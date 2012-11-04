define(['jquery', 'backbone'], function($, Backbone) {
    var CodeListView = Backbone.View.extend({

        initialize: function() {
            window.controller.codeCollection.on("change add remove", this.render, this);
            window.controller.on("filterChanged", this.updateCodeListView, this);
        },

        events: {
            "click .CodeListViewItem": "itemClicked"
        },

        itemClicked: function(event) {
            var codeClicked = window.controller.codeCollection.get($(event.currentTarget).data('id'));
            this.trigger('codeClicked', codeClicked);
        },

        render: function() {
            //Reset before creating elements
            this.$el.html('');

            var self = this;
            //Add all the codes
            window.controller.codeCollection.each(function(code, i) {
                var desc = "no description";
                if (code.get('description').length > 0) {
                    desc = code.get('description');
                }
                self.$el.append("<div class='CodeListViewItem' title='" + desc + "' data-id='"+code.get('id')+"'>"+code.get('name')+"</div>");
            });

            //Add the new code thing
            this.$el.append("<div id='CodeListViewNewCode'>new code</div>");
            //and hide it
            $("#CodeListViewNewCode").hide();
        },

        getCurrentCode: function(){
            var found = $(".CodeListViewItem.found");
            console.log(found);
            if(found.length==1) {
                return window.controller.codeCollection.get($(".CodeListViewItem.found").data('id'));
            } else {
            //                return $("#CodeListViewNewCode").text();
            }
        },

        updateCodeListView: function(new_term){
            new_term = $.trim(new_term).toLowerCase();

            var old_term = this.term;
            if(typeof old_term == 'undefined')
                old_term = "";

            if(new_term==old_term) return;

            $(".CodeListViewItem.first").removeClass("first");

            if(new_term==""){
                $(".CodeListViewItem.on").removeClass("on");
                $(".CodeListViewItem.off").show().removeClass("off");
            }else{
                $(".CodeListViewItem").addClass(function(){
                    var index = $(this).text().indexOf(new_term);
                    if(index==-1){
                        $(this).fadeOut("fast");
                        $(this).removeClass("on");
                        return "off";
                    }
                    if(index==0){
                        $(this).addClass("first");
                    }
                    $(this).removeClass("off");
                    $(this).fadeIn("fast");
                    return "on";
                });
            }

            var firsts = $(".CodeListViewItem.on.first").size();
            var total = $(".CodeListViewItem.on").size();
            $(".CodeListViewItem.found").removeClass("found");

            this.term = new_term;

            if(total==1 || firsts>0){
                if(total==1) $(".CodeListViewItem.on").addClass("found");
                else $(".CodeListViewItem.first").first().addClass("found");
                $("#CodeListViewNewCode").fadeOut('fast');
            }
            else{
                $("#CodeListViewNewCode").fadeIn('fast');
                $("#CodeListViewNewCode").text(new_term);
            }

        }


    });
    return CodeListView;
});