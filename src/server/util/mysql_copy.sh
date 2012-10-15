#!/bin/bash

# Copies one database to another
set -e

# We need these parameters from the caller
FROM_DATABASE=$1
TO_DATABASE=$2

echo "Copying <$FROM_DATABASE> to <$TO_DATABASE>"

if [ -z "$FROM_DATABASE" ]; then
    echo "No from-database given"
    exit 1
fi

if [ -z "$TO_DATABASE" ]; then
    echo "No to-database given"
    exit 1
fi

MYSQL_CONNECTION_OPTS="-h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_DEPLOY_USER --password=$MYSQL_DEPLOY_PASSWORD"
echo $MYSQL_CONNECTION

# Drop the test database if it exists
echo "Dropping database <$TO_DATABASE>..."
${MYSQL_BINDIR}/mysqladmin drop $TO_DATABASE --force $MYSQL_CONNECTION_OPTS || true

# Create the database fresh
${MYSQL_BINDIR}/mysqladmin create $TO_DATABASE $MYSQL_CONNECTION_OPTS

echo "Created database <$TO_DATABASE>."
echo "Copying data from $FROM_DATABASE into $TO_DATABASE..."
# Pipe data in from the production database
${MYSQL_BINDIR}/mysqldump $MYSQL_CONNECTION_OPTS $FROM_DATABASE | ${MYSQL_BINDIR}/mysql $MYSQL_CONNECTION_OPTS $TO_DATABASE

echo "Copy complete."
