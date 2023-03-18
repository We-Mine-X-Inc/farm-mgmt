#!/bin/bash

# Path is defined in appspec.yml
INITIAL_PUSH_LOCATION=/home/ubuntu/applications/all-composites-temp

# Delete the old temp directory.
if [ -d $INITIAL_PUSH_LOCATION ]; then
    rm -rf $INITIAL_PUSH_LOCATION
fi