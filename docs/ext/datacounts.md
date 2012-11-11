# Extended API Data Counts Module

This section of the Extended API provides general information about the entire
data set in terms of counts. All calls return a single number; this may be a
raw number, or a percentage, depending on the call. An exhaustive mapping (to
reduce network load for a full summary) is available through the index call.

## Streaming Data and Parameterizing Calls

Each non-summary call corresponds to a count over data. Some data are streaming,
and some are not - meaning, that countable objects are associated with
timestamps.

Streaming data count calls have exactly one parameter, the *days* (for example,
 0, 1, 7, or 30) that refers to the number of most recent days over which to
summarize; 0 means no constraint. Any integer will be interpreted, but 1, 7 and
30 are recommended as most sensible. The purpose of this is to capture a delta;
for example, the # of messages coded in the last 7 days. We are currently
assuming non-streaming messages, code scheme, and participants, so this is not
a meaningful parameter on the number of those objects.

The summary call also accepts the days range parameter, and passes it to all
parameterizable functions. So, calling summary with days=7, will result in a
map equivalent to having called messages unparameterized and coded_messages
with days=7.

## Summary

### Get an exhaustive map of all available counts: `GET /data_counts/summary/`

Parameters:
* **`days`: an integer >=0; default 0, meaning forever**

Response:
* 200: The body contains a JSON map from the names of the corresponding function
  calls and the results.
* 400: The body contains an error message.
* 404: The body contains an error message.

## Messages

### Get the number of messages in the dataset: `GET /data_counts/messages/`

Response:
* 200: The body contains a single positive integer.
* 400: The body contains an error message.
* 404: The body contains an error message.

## Participants

### Get the number of participants: `GET /data_counts/participants/`

Response:
* 200: The body contains a single positive integer.
* 400: The body contains an error message.
* 404: The body contains an error message.

## Codes

### Get the number of codes: `GET /data_counts/codes/`

Response:
* 200: The body contains a single positive integer.
* 400: The body contains an error message.
* 404: The body contains an error message.

## Coded Messages

### Get the number of coded messages: `GET /data_counts/coded_messages/`

Coded messages are those associated with at least one code instance, which
was applied in the given day range.

Parameters:
* **`days`: an integer >=0; default 0, meaning forever**

Response:
* 200: The body contains a single positive integer.
* 400: The body contains an error message.
* 404: The body contains an error message.

## Percent Coded Messages

### Get percent of coded messages: `GET /data_counts/percent_coded_messages/`

Out of the total number of messages ever.

Parameters:
* **`days`: an integer >=0; default 0, meaning forever**

Response:
* 200: The body contains a single positive integer.
* 400: The body contains an error message.
* 404: The body contains an error message.

## Instantiated Codes

### Get the number of instantiated codes: `GET /data_counts/instantiated_codes/`

Parameters:
* **`days`: an integer >=0; default 0, meaning forever**

Response:
* 200: The body contains a single positive integer.
* 400: The body contains an error message.
* 404: The body contains an error message.

## Coders

### Get the number of people actively coding: `GET /data_counts/coders/`

Actively coding refers to any user of TextPrizm having applied one or more code
instance in the specified day range.

Parameters:
* **`days`: an integer >=0; default 0, meaning forever**

Response:
* 200: The body contains a single positive integer.
* 400: The body contains an error message.
* 404: The body contains an error message.

