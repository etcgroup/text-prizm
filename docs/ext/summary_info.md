# Extended API Summary Info Module

The summary info portion of the extended API provides general descriptive information about each of the resources. Many of the calls provide histogram data about the messages or the instances of codes, and thus return sets of counts. 



## Codes

### Instances over time `GET /ext/summary_info/codes/applied_counts`

Retrieves binned code instance counts over the range [`time_start`,`time_end`] with `bin_count` bins for code `code_id`.

Time in this case is time the instance was applied.


Parameters:
* **`code_id`: a code id (required)**
* **`time_start`: starting time -- unixtime (defaults to 0)**
* **`time_end`: ending time -- unixtime (defaults to maxint)**
* **`bin_count`: the number of bins (defaults to 10)**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: `id` not found or invalid


### Messages with code instance over time `GET /ext/summary_info/codes/message_counts`

Retrieves binned counts of messages with code instances over the range [`time_start`,`time_end`] with `bin_counts` bins for `code_id`. 

Parameters:
* **`code_id`: a code id (required)**
* **`time_start`: starting time -- unixtime (defaults to 0)**
* **`time_end`: ending time (defaults to maxint)**
* **`bin_count`: the number of bins (defaults to 10)**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: `id` not found or invalid



### Code instances by participant `GET /ext/summary_info/codes/participant`

Retrieves the number of code instances of `code_id` for each participant sorted from highest to lowest count and limited to `num_results` participants. 

Parameters:
* **`code_id`: a code id (required)**
* **`num_results`: maximum number of participants to return (defaults to 10)**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: The body contains an error message.



### Code instances by day (session/cluster) `GET /ext/summary_info/codes/daily_instances`

Retrieves a list of `num_results` of the days/or sessions with the highest counts of code instances for  `code_id`. Results are ordered from highest to lowest.



Parameters:
* **`code_id`: a code id (required)**
* **`num_results`: maximum number of results (defaults to 10)**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: The body contains an error message.



### Code instances by user `GET /ext/summary_info/codes/user`

Retrieves an array of the number of code instances for `code_id` for each user. Results are ordered from highest to lowest and a maximum of `num_results`. 

Parameters:
* **`code_id`: a code id (required)**
* **`num_results`: maximum number of results to return (defaults to 10)**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: The body contains an error message.




## User

### Code instances by application time `GET /ext/summary_info/user/instance_application`

Retrieves binned counts of code instances applied by `user_id` over the range [`time_start`,`time_end`] with `bin_counts` bins. Time in this call is the time the instance was applied.

Parameters:
* **`user_id`: a user id (required)**
* **`time_start`: starting time -- unixtime (defaults to 0)**
* **`time_end`: ending time -- unixtime (defaults to maxint)**
* **`bin_count`: the number of bins (defaults to 10)**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: `id` not found or invalid



### Messages coded by application time `GET /ext/summary_info/user/message_application`

Retrieves binned counts of code instances applied by `user_id` over the range [`time_start`,`time_end`] with `bin_counts` bins. Time in this call is the time the instance was applied.

Parameters:
* **`user_id`: a user id (required)**
* **`time_start`: starting time -- unixtime (defaults to 0)**
* **`time_end`: ending time -- unixtime (defaults to maxint)**
* **`bin_count`: the number of bins (defaults to 10)**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: `id` not found or invalid



### Code instance counts by day (session/cluster) `GET /ext/summary_info/user/daily_instances`

Retrieves the number of code instances applied by `user_id` for each day (session/cluster). Results are ordered from highest to lowest counts and a maximum of `num_results`. 

Parameters:
* **`user_id`: a user id (required)**
* **`num_results`: maximum number of results to return (defaults to 10)**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: The body contains an error message.



### Messages coded by day (sesion/cluster) `GET /ext/summary_info/user/daily_messages`

Retrieves the number of messages with code_instances applied by `user_id` for each day (session/cluster). Results are ordered from highest to lowest counts and a maximum of `num_results`. 

Parameters:
* **`user_id`: a user id (required)**
* **`num_results`: maximum number of results to return (defaults to 10)**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: The body contains an error message.




### Applied code instance counts by user `GET /ext/summary_info/user/code_instances`

Retrieves an ordered array of the number of code instances applied by `user_id` and grouped by the code. The number of results is limited by the `num_results` codes.


Parameters:
* **`user_id`: a user id (required)**
* **`num_results`: maximum number of results to return (defaults to 10)**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: The body contains an error message.





## Participant

### Number of messages over time `GET /ext/summary_info/participant/message_counts`

Retrieves an array of binned message counts over the range [`time_start`,`time_end`] with `bin_count` bins. 

Parameters:
* **`participant_id`: a participant id (required)**
* **`time_start`: starting time -- unixtime (defaults to 0)**
* **`time_end`: ending time -- unixtime (defaults to maxint)**
* **`bin_count`: the number of bins (defaults to 10)**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: `id` not found or invalid



### Message count by hour of day  `GET /ext/summary_info/participant/hourofday_counts`


Retrieves an array of binned message counts over the range [`time_start`,`time_end`] grouped by the hour of the day UTC. 

`time_start` and `time_end` are datetimes specify the the range of messages over which the counts are calculated.


Parameters:
* **`participant_id`: a participant id (required)**
* **`time_start`: starting time -- unixtime (defaults to 0)**
* **`time_end`: ending time -- unixtime (defaults to maxint)**


Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: `id` not found or invalid



### Message count by day `GET /ext/summary_info/participant/daily_counts`


Retrieves an array of message counts for `participant_id`   for each day (session/cluster). Results are ordered from highest to lowest counts and a maximum of `num_results` are returned.

Parameters:
* **`participant_id`: a participant id (required)**
* **`num_results`: maximum number of results to return (defaults to 10)**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: The body contains an error message.



### Number of participants messages labelled with code instance  `GET /ext/summary_info/participant/code_messages`


Retrieves an array of message counts for `participant_id`   for code. Results are ordered from highest to lowest counts and a maximum of `num_results` are returned.

Parameters:
* **`participant_id`: a participant id (required)**
* **`num_results`: maximum number of results to return (defaults to 10)**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: The body contains an error message.

