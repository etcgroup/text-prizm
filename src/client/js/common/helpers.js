define(['moment'], function(moment) {

   var Helpers = {
       /**
        * Given a git long hash, returns a short hash (the first 8 characters).
        */
       git_short_hash: function(long_hash) {
           return long_hash.toString().slice(0, 8);
       },

       /**
        * Given a timestamp, returns a long formatted
        * date-time with month, day, year, hour, minute, and second.
        */
       long_date_time: function(timestamp) {
           var date = moment.unix(timestamp);
           return date.format('MMMM Do YYYY, h:mm:ss a');
       },

       /**
        * Given a timestamp, returns a medium formatted
        * date-time with month, day, year, hour, and minute.
        */
       medium_date_time: function(timestamp) {
           var date = moment.unix(timestamp);
           return date.format('MMM Do YYYY, h:mm a');
       }
   };

   return Helpers;
});