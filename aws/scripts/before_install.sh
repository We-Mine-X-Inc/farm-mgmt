#!/bin/bash

export HOME="/home/ubuntu"

# Delete the old  directory as needed.
if [ -d /home/ubuntu/applications/farm-mgmt ]; then
    rm -rf /home/ubuntu/applications/farm-mgmt
fi