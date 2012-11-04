require(['jquery', 'lib/jquery.rating'],
    function($) {
        function rate(message_id,rating){
            console.log(message_id,rating,window.user_id);
            $.get('codebrowser/rate/' + message_id + '/' + window.user_id + '/' + rating);
        }
        $(document).ready(function() {
            $('.srating').rating({
                callback: function(value, link){
                    rate($(this).data('id'),value);
                }
            });
        });

    });