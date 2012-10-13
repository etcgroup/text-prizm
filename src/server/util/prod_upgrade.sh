#!/bin/bash

# Copy the production data and create the install config
set -e

source $HOME/credentials.sh

# The first argument is the name for this installation
INSTALL_NAME=$1

echo "Using production ${MYSQL_PROD_DATABASE} database"

PROD_BASEURL=$BASE_URL/$INSTALL_NAME
BACKUP_DATABASE=${MYSQL_PROD_DATABASE}_backup

# Back up the production data
$PUBLIC_HTML/$INSTALL_NAME/application/util/mysql_copy.sh $MYSQL_PROD_DATABASE $BACKUP_DATABASE

# Run the upgrade script
php $PUBLIC_HTML/$INSTALL_NAME/application/util/manage.php upgrade

echo "Done setting up production"
