# Didi Computation REST API

This exposes task creation and assignment, as well as volunteer machine registration. The base URL is `/didi/comp/`; for example, to ask for a new task, use `GET /didi/comp/task`

A *task* is specified by a JSON object containing:
* `files` - a JSON array with either comma-separated points or ranges of time, to be interpreted by didi-client in a data fetch; each of these is the 'file' to be assigned by mapreduce master to slaves
* `type` - a string uniquely identifying the task type (determines eligibility, and functionality)
* `parameters` - a JSON object with any parameters the task needs (eg, the threshold for threshold segmentation, etc.)

A *machine* is specified by a string *location*, comprising of `ip:port`

## Tasks

### Retrieve a task to execute: `GET /task/`

Returns a task to work on, based on existing outstanding tasks, along with a list of eligible machines that can work on it. This task if returned having taken into account any outstanding dependencies, and the machines that are able to execute this task. This need not be parameterized.

No parameters.

Response:
* 200: The body contains `null` if no tasks need to be done, or a JSON object with a `task` (*task* objects) and `machines` (array of *machine* objects)

### Create a new task: `PUT /task/`

Parameters:
* `files` - a JSON array with either comma-separated points or ranges of time, to be interpreted by didi-client in a data fetch; each of these is the 'file' to be assigned by mapreduce master to slaves
* `type` - a string uniquely identifying the task type (determines eligibility, and functionality)
* `parameters` - a JSON object with any parameters the task needs (eg, the threshold for threshold segmentation, etc.)

Response:
* 201: The body contains the new task, including `id`.
* 400: The body contains an error message.
* 404: The body contains an error message.

### Delete a task: `DELETE /task/`

To cancel a task (and any dependent tasks - this cascade enforced at app level). This way, the only machine capable of deleting a task is the one that creates it.

Parameters:
* `id` - maintained from doing a 'put task'

Response:
* 200: OK
* 400: The body contains an error message.
* 404: The body contains an error message.

## Machines

### Register a new machine: `PUT /machine/`

This must be called when a machine is available to accept work.

Parameters:
* `location` - eg, ip:port
* `name` - a human-readable moniker
* `types` - a JSON array of strings uniquely identifying task types that this machine is capable of performing.

Response:

* 201: The body contains the new machine.
* 400: The body contains an error message.
* 404: The body contains an error message.

### Renew registration: `POST /machine/`

This should periodically (at least once every 24 hours) be called as a 'heartbeat;' machines which do not renew registration in over 24 hours are removed.

Parameters:
* `location` - eg, ip:port

Response:
* 200: The body contains the updated machine.
* 400: The body contains an error message.
* 404: The body contains an error message.


## Availability

### Declare machine available: `POST /available/`

Parameters:
* `location` - a location of a machine
* `locations` - a list of locations of machines
* Either `location` or `locations` must be supplied, and must specify machines

Response
* 200: body contains updated machine
* 400: if neither location nor locations is provided
* 404: if location or locations specify nonexistent machines

### Declare machine busy: `POST /busy/`

Parameters:
* `location` - a location of a machine
* `locations` - a list of locations of machines
* Either `location` or `locations` must be supplied, and must specify machines

Response
* 200: body contains updated machine
* 400: if neither location nor locations is provided
* 404: if location or locations specify nonexistent machines


## Jobs

### Create a job: `PUT /job/`

Parameters:
* `tasks` - a JSON array of *task* objects (as specified above)
* `description`
* `user_id`

### Cancel a job: `DELETE /job/`

* `id` - the id of the job