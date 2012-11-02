# REST API Documentation

Text Prizm provides a RESTful API for working with basic data entities.

The REST API is useful for low level data access and modification.
For example, if you wanted to download all of the messages in
a given message cluster, the REST API would be the way to do it.

However, if you wanted to compute the mean and standard deviation
of the lengths of all of the messages in the data set, you might
want to check out the [[Extended API|Extended API Documentation]].

**The base URL for accessing the REST API is `/rest/`.**
For example, to GET messages, request `/rest/messages`

## REST API Docs Index

* [Data](rest/data.md)