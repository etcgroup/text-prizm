# Didi Database model

Relations:
* didi_machine(**id**, ip, port, last_ping, bool is_busy)
* didi_abilities(**machine_id**, varchar **task_type**)
* didi_tasks(**id**, task_type, params, files)
* didi_task_list(**id**, task_id_list, length, progress, current_status_id, added, description)
* didi_status(**id**, task_id, started, updated, [pointer to hadoop master], [progress 0-100])

## Get a new task to work on

The idea to is fetch the next task in a task-list
```sql
SELECT * FROM didi_task_list task_list
    WHERE progress<length
```
