<?php
header('HTTP/1.1 503 Service Temporarily Unavailable', true, 503);
header('Status: 503 Service Temporarily Unavailable');
header('Retry-After: 172800');
?>
<!DOCTYPE HTML>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="Content-Language" content="en-us">
        <meta name="robots" content="noindex,nofollow">
        <title>Temporary Maintenance</title>
        <style type="text/css">
            body {
                background: #00A;
                color: #eee;
                font-family: "Courier New", Courier, monospace;
                margin: 30px;
            }

            #player {
                margin-top: 30px;
            }
        </style>
    </head>
    <body>

        <div id="page">
            <h3>We are temporarily down for routine maintenance.</h3>

            <p>Normal operation will resume as soon as possible.</p>

            <p>Enjoy these random videos while we complete our upgrades!</p>

            <div id="player"></div>
        </div>

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>

        <script>

            //http://konstruktors.com/blog/web-design/3384-embed-youtube-channel-playlist/
            (function() {
                function createPlayer(jqe, video, options) {
                    var ifr = $('iframe', jqe);
                    if (ifr.length === 0) {
                        ifr = $('<iframe scrolling="no" frameborder="no">');
                        ifr.addClass('player');
                        if (options.playeropts)
                            ifr.attr(options.playeropts);
                    }
                    var src = 'http://www.youtube.com/embed/' + video;
                    if (options.playopts) {
                        src += '?';
                        for (var k in options.playopts) {
                            src+= k + '=' + options.playopts[k] + '&';
                        }
                    }
                    ifr.attr('src', src);
                    jqe.append(ifr);
                }

                //shuffles list in-place
                function shuffle(list) {
                    var i, j, t;
                    for (i = 1; i < list.length; i++) {
                        j = Math.floor(Math.random()*(1+i));  // choose j in [0..i]
                        if (j != i) {
                            t = list[i];                        // swap list[i] and list[j]
                            list[i] = list[j];
                            list[j] = t;
                        }
                    }
                }

                var defoptions = {
                    autoplay: false,
                    user: null,
                    player: createPlayer,
                    playeropts: {},
                    loaded: function() {},
                    playopts: {
                        fs: 1,
                        showinfo: 1,
                        modestbranding: 1
                    }
                };

                $.fn.extend({
                    youTubeChannel: function(options) {
                        var md = $(this);
                        var allopts = $.extend(true, {}, defoptions, options);
                        var queryUrl = 'https://gdata.youtube.com/feeds/api/videos?q=' + allopts.query + '&max-results=30&v=2&alt=json';
                        $.getJSON(queryUrl, null, function(data) {
                            var videos = [];
                            var playlist = '';
                            $.each(data.feed.entry, function(i, item) {
                                var id = item["media$group"]["yt$videoid"]["$t"];
                                videos.push(id);
                            });
                            shuffle(videos);

                            $.each(videos, function(i, id) {
                                if (i > 0) {
                                    playlist += id + ',';
                                }
                            });

                            allopts.playopts.playlist = playlist;
                            allopts.player(md, videos[0], allopts);
                        });

                        return md;
                    }
                });

            })();

            $(function() {
                $('#player').youTubeChannel({
                    query:'sleepy+cat',
                    playeropts: {
                        height: '390',
                        width: '640'
                    }
                });
            });
        </script>

    </body>
</html>