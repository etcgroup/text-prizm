# Extended API App Status Module

This section of the Extended API provides information about the
status of the application. All information is currently provided
in a single call, but more specialized calls may be added later
for flexibility.

## Application Status Summary

### Get a summary map of status info: `GET /app_status/summary/`

Currently supported status includes:
* `app_name`: the name of the app.
* `repo_url`: the url to the repository
* `build_version`: the current version number.
* `build_time`: the timestamp when this build was created.
* `build_revision`: the git revision hash.
* `upgrade_time`: the timestamp this build was installed/upgraded.
* `database_host`: the database hostname.
* `database_schema`: the database schema.
* `database_migration`: the current migration number.

Response:
* 200: The body contains a JSON map containing the status info.
* 400: The body contains an error message.
* 404: The body contains an error message.
