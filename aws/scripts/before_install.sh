#!/bin/bash

# Path is defined in appspec.yml
INITIAL_PUSH_LOCATION=/home/ubuntu/applications/all-composites-temp

# Delete the old temp directory.
if [ -d $INITIAL_PUSH_LOCATION ]; then
    rm -rf $INITIAL_PUSH_LOCATION
fi

# Verify npm is installed.
npm -v
if [ $? -eq 0 ]; then
    echo "npm is not installed."
    exit 1;
fi

# Verify node is installed.
node -v
if [ $? -eq 0 ]; then
    echo "node is not installed."
    exit 1;
fi

# Verify pm2 is installed.
npm list -g | grep pm2
if [ $? -eq 0 ]; then
    pm2 delete $PM2_JOB_NAME
else
    echo "PM2 does not exist."
    exit 1;
fi