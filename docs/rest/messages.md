# REST API Messages Module

This section of the REST API covers paged message collections.

### Get a page of messages: `GET messages/page`

Each message will include the `participant` information,
along with the list of code `instances`. Code instances will include `code`
and `user` information.

Parameters:
* `start`: retrieve messages after this MySQL datetime
* `cluster`: retrieve messages with this cluster id
* `limit`: The maximum number of messages to retrieve (defaults to 100)
* `offset`: The number of messages to skip (defaults to 0)

Response:
* 200: The body contains the requested messages.
* 400: The body contains an error message.
* 404: The body contains an error message.

### Count the total number of matching messages: `GET messages/count`

Parameters:
* `start`: retrieve messages after this MySQL datetime
* `end`: retrieve messages until this MySQL datetime
* `cluster`: retrieve messages with this cluster id

### Get code instances for a page of messages: `GET messages/code_instances`

Each code instance includes information about its code.

Parameters:
* `start`: retrieve messages after this MySQL datetime
* `cluster`: retrieve messages with this cluster id
