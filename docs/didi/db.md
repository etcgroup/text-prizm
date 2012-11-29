# Didi Database

This describes the database and the logic provided by Didi library

Relations:
* didi_machine(**id** , ip, port, last_ping, bool is_busy)
* didi_abilities(**machine_id** , varchar **task_type**)
* didi_tasks(**id** , task_type, params, files)
* didi_task_list(**id** , task_id_list, task_count, progress, added, description)
** index on added
** description is varchar 200
* didi_status(**id** , task_list_id, task_id, started, updated, [pointer to hadoop master], [progress 0-100], bool has_failed)
** index on task_id, has_failed

## Get a new task to work on

Implemented by Didi->next_task()

1. Fetch the next task in a task-list:

```sql
SELECT task_list.task_id_list, progress
    FROM didi_task_list task_list
    WHERE task_list.progress < task_list.task_count
        AND current_status_id = NULL
    ORDER BY added ASC
```

2. For each (task list, progress), can identify the task_id. Then, fetch the number of failures on this task thus far:

```sql
SELECT COUNT(*) failures fROM didi_status WHERE task_id=[task_id] and has_failed=TRUE
```

With probability `failures / (K + failures)`, go on to the next task, skipping this one. Otherwise, assign this task, and break. For the purposes of this implementation, let K be 1; this way, we are aggressively favoring tasks that have failed fewer times.

## Get outstanding tasks

```sql
SELECT task_list.description, task_list.progress, task_list.count,
        status.task_id, task.task_type, task.params,
        status.progress, status.started, status.has_failed
    FROM didi_task_list task_list
    LEFT JOIN didi_status
    ON didi_status.task_list_id=task_list.id
    LEFT JOIN didi_tasks task
    ON didi_status.task_id=task.id
    ORDER BY has_failed, status.started ASC
```



