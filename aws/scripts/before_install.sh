#!/bin/bash

# Set LAUNCH_ENV to dictate which folders will be mutated.
LAUNCH_ENV=prod

# Delete the old  directory as needed.
if [ -d /home/ubuntu/applications/farm-mgmt/$LAUNCH_ENV ]; then
    rm -rf /home/ubuntu/applications/farm-mgmt/$LAUNCH_ENV
fi