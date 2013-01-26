define([],
    function() {

        var api = {
            url: function(urlString) {
                if (urlString.length > 1) {
                    if (urlString[0] == '/') {
                        urlString = urlString.slice(1);
                    }
                }
                return baseUrl + urlString;
            }
        }

        return api;

    });
