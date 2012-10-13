#!/bin/bash

# Copy the production data and create the install config
set -e

source $HOME/credentials.sh

# The first argument is the name for this test (the branch name)
TEST_NAME=$1

echo "Testing based on ${MYSQL_PROD_DATABASE} database"

TEST_DATABASE=${MYSQL_PROD_DATABASE}_${TEST_NAME}
TEST_BASEURL=$BASE_URL/$TEST_NAME

# Copy the production data
$PUBLIC_HTML/$TEST_NAME/application/util/mysql_copy.sh $MYSQL_PROD_DATABASE $TEST_DATABASE

# Run the install script with input
php $PUBLIC_HTML/$TEST_NAME/application/util/manage.php install <<EOF
y
${MYSQL_RUNTIME_HOST}:${MYSQL_PORT}
$MYSQL_TEST_USER
$MYSQL_TEST_PASSWORD
$TEST_DATABASE
$TEST_BASEURL
$HTACCESS_HEADER
EOF

echo "Done setting up test"