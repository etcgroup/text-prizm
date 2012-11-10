# REST API Activities Module

This section of the REST API provides information about activities.

The basic operations available are to get a single activity, get
a list of recent activities, and post a new activity.

## Retrieving Activities

### Get an activity: `GET /activities/activity`

Parameters:
* **`id`: an integer activity id (required)**

Response:
* 200: The body contains the activity object.
* 400: The body contains an error message.
* 404: The body contains an error message.

### Get a list of recent activities: `GET /activities/recent`

Parameters:
* `limit`: The maximum number of activities to retrieve (defaults to 10)
* `offset`: The number of activities to skip (defaults to 0)

Response
* 200: The body contains a collection of activities.
* 400: The body contains an error message.
* 404: The body contains an error message.

## Adding Activities

### Add an activity: `PUT /activities/activity`

Parameters:
* **`user_id`: The integer id of the user who performed the activity (required)**
* **`activity_type`: The string type of the activity (required)**
* `time`: The timestamp when the activity occurred (defaults to current time)
* `data`: Any additional data for the activity, **as a string** (defaults to empty)

Response
* 200: The body contains the inserted activity.
* 400: The body contains an error message.
* 404: The body contains an error message.
