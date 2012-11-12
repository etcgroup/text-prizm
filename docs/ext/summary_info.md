# Extended API Data Set Info Module

This section of the Extended Info provides summary information about specific aspects of the dataset.

## Codes

### Instances over time `GET /ext/summary_info/codes/instances`

Retrieves binned code instance counts over the range [`time_start`,`time_end`] with `bin_count` bins for code `code_id`.

Parameters:
* **`code_id`: a code id**
* **`time_start`: starting time **
* **`time_end`: ending time **
* **`bin_count`: the number of bins **

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: `id` not found or invalid


### Messages with code over time `GET /ext/summary_info/codes/messages`

Retrieves binned counts of messages with code instances over the range [`time_start`,`time_end`] with `bin_counts` bins for `code_id`. 

Parameters:
* **`code_id`: a code id**
* **`time_start`: starting time **
* **`time_end`: ending time **
* **`bin_count`: the number of bins **

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: `id` not found or invalid



### Code instances by participant `GET /ext/summary_info/codes/participant`

Retrieves the number of code instances of `code_id` for each participant sorted from greatest to least and limited to `num_results` participants. 

Parameters:
* **`code_id`: a code id**
* **`num_results`: maximum number of participants to return**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: The body contains an error message.



### Code instances by day (session/cluster) `GET /ext/summary_info/codes/daily_instances`

Retrieves the days/or sessions with the highest counts of code instances for  `code_id`. The results are limited to `num_results` days/sessions. Results are ordered from highest to lowest.



Parameters:
* **`code_id`: a code id**
* **`num_results`: maximum number of results**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: The body contains an error message.



### Code instances by user `GET /ext/summary_info/codes/user`

Retrieves the number of code instances for `code_id` for each user. Results are ordered from highest to lowest and a maximum of `num_results`. 

Parameters:
* **`code_id`: a code id**
* **`num_results`: maximum number of results to return**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: The bod* y contains an error message.




## User

### Code instances by application time `GET /ext/summary_info/user/instance_application`

Retrieves binned counts of code instances applied by `user_id` over the range [`time_start`,`time_end`] with `bin_counts` bins. Time in this call is the time the instance was applied.

Parameters:
* **`user_id`: a user id**
* **`time_start`: starting time **
* **`time_end`: ending time **
* **`bin_count`: the number of bins **

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: `id` not found or invalid



### Messages coded by application time `GET /ext/summary_info/user/message_application`

Retrieves binned counts of code instances applied by `user_id` over the range [`time_start`,`time_end`] with `bin_counts` bins. Time in this call is the time the instance was applied.

Parameters:
* **`user_id`: a user id**
* **`time_start`: starting time **
* **`time_end`: ending time **
* **`bin_count`: the number of bins **

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: `id` not found or invalid



### Code instance counts by day (session/cluster) `GET /ext/summary_info/user/daily_instances`

Retrieves the number of code instances applied by `user_id` for each day (session/cluster). Results are ordered from highest to lowest counts and a maximum of `num_results`. 

Parameters:
* **`user_id`: a user id**
* **`num_results`: maximum number of results to return**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: The body contains an error message.



### Messages coded by day (sesion/cluster) `GET /ext/summary_info/user/daily_messages`

Retrieves the number of messages with code_instances applied by `user_id` for each day (session/cluster). Results are ordered from highest to lowest counts and a maximum of `num_results`. 

Parameters:
* **`user_id`: a user id**
* **`num_results`: maximum number of results to return**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: The body contains an error message.



### Percentage of applied code instances by code `GET /ext/summary_info/user/code_percentages`

Retrieves an ordered list of percentages of codes applied by `user_id` and grouped by the code. The number of results is limited by the `num_results` codes.

The percentages are the percentage of total code instances coded by `user_id` that were coded as `code_id`. 


Parameters:
* **`user_id`: a user id**
* **`num_results`: maximum number of results to return**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: The body contains an error message.



### Number of applied code instances by code `GET /ext/summary_info/user/code_instances`

Retrieves an ordered list of percentages of codes applied by `user_id` and grouped by the code. The number of results is limited by the `num_results` codes.

The percentages are the percentage of total code instances coded by `user_id` that were coded as `code_id`. 


Parameters:
* **`user_id`: a user id**
* **`num_results`: maximum number of results to return**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: The body contains an error message.





## Participant

### Number of messages over time `GET /ext/summary_info/participant/message_count`

Retrieves an array of binned message counts over the range [`time_start`,`time_end`] with `bin_count` bins. 

Parameters:
* **`participant_id`: a participant id**
* **`time_start`: starting time **
* **`time_end`: ending time **
* **`bin_count`: the number of bins **

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: `id` not found or invalid



### Percentage of messages over time `GET /ext/summary_info/participant/message_percentages`


Retrieves an array of binned percentages over the range [`time_start`,`time_end`] with `bin_count` bins. 

Percentage is the percentage of users messages as a contribution to the total messages in that bin. 

Parameters:
* **`participant_id`: a participant id**
* **`time_start`: starting time **
* **`time_end`: ending time **
* **`bin_count`: the number of bins **

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: `id` not found or invalid



### Message count by hour of day  `GET /ext/summary_info/participant/hourly_count`


Retrieves an array of binned message counts over the range [`time_start`,`time_end`] grouped by the hour of the day UTC. 

`time_start` and `time_end` are datetimes specify the the range of messages over which the counts are calculated.


Parameters:
* **`participant_id`: a participant id**
* **`time_start`: starting time **
* **`time_end`: ending time **


Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: `id` not found or invalid



### Percent of messages by hour of day  `GET /ext/summary_info/participant/hourly_percentage`


Retrieves an array of message percentages over the range [`time_start`,`time_end`] grouped by the hour of the day UTC. Percentages are calculated based on the users contribution to the total message count for all users during that hour. 

`time_start` and `time_end` are datetimes specify the the range of messages over which the counts are calculated.



Parameters:
* **`participant_id`: a participant id**
* **`time_start`: starting time **
* **`time_end`: ending time **


Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: `id` not found or invalid



### Message count by cluster (day)  `GET /ext/summary_info/participant/daily_count`


Retrieves an array of message counts for `participant_id`   for each day (session/cluster). Results are ordered from highest to lowest counts and a maximum of `num_results` are returned.

Parameters:
* **`participant_id`: a participant id**
* **`num_results`: maximum number of results to return**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: The body contains an error message.


### Percent of messages by cluster `GET /ext/summary_info/participant/daily_percentage`


Retrieves an array of percentages for `participant_id`   for each day (session/cluster). Results are ordered from highest to lowest counts and a maximum of `num_results` are returned.

Percentage in this case means the proportion of user contributions to the overall message count for each cluster. 

Parameters:
* **`participant_id`: a participant id**
* **`num_results`: maximum number of results to return**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: The body contains an error message.


### Number of participants messages labelled with code instance  `GET /ext/summary_info/participant/code_instances`


Retrieves an array of message counts for `participant_id`   for code. Results are ordered from highest to lowest counts and a maximum of `num_results` are returned.

Parameters:
* **`participant_id`: a participant id**
* **`num_results`: maximum number of results to return**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: The body contains an error message.

### Percentage of participant's messages labelled with code instance  `GET /ext/summary_info/participant/code_percentages`


Retrieves an array of percentages for `participant_id`   for each count. Results are ordered from highest to lowest counts and a maximum of `num_results` are returned.

Percentage in this case means the proportion of user contributions to the overall message count for each code. 

Parameters:
* **`participant_id`: a participant id**
* **`num_results`: maximum number of results to return**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: The body contains an error message.
