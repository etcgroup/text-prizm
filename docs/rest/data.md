# REST API Data Module

This section of the REST API covers static data resources
(such as messages and participants).

## Messages

### Get a message by id: `GET /point/`

Parameters:
* **`id`: a message id**

Response:
* 200: The body contains the data for the requested message.
* 400: The body contains an error message.
* 404: The body contains an error message.

### Get a list of messages: `GET /points/`

Parameters:
* `session_id`: Retrieve messages from this session.
* `time_from`: Retrieve messages after this time.
* `time_to`: Retrieve messages before this time.
* `idx_from`: Retrieve messages with an idx greater than that provided.
* `idx_to`: Retrieve messages with an idx less than that provided.
* `participant_id`: Retrieve only messages from the given participant.

Response:
* 200: The body is a collection of the requested messages.
* 400: The body contains an error message.
* 404: The body contains an error message.

## Participants

### Get a participant by id: `GET /participant/`

Parameters:
* **`id`: a participant id**

Response:
* 200: The body contains the data for the requested participant.
* 400: The body contains an error message.
* 404: The body contains an error message.

### Get a list of participants: `GET /participants/`

Parameters:
* `name_like`: Retrieve participants whose names match the provided MySQL `LIKE` value.

Response:
* 200: The body contains the data for the requested participants.
* 400: The body contains an error message.
* 404: The body contains an error message.
