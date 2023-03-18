#!/bin/bash

# Note: This script is run for the current server being deployed. So instead of this being
# used immediately to stop the server currently in production, it is used for the current
# and will therefore not be executed until the next push.

SHOULD_STOP_COMPOSITE=false
LAUNCH_ENV=prod
COMPOSITE_NAME=farm_mgmt_BE # Defined within ecosystem.config.js

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Verify npm is installed.
npm -v
if [ $? -eq 0 ]; then
    echo "npm is not installed."
    exit 1;
fi

# Stop an existing composite job if necessary.
if [ $SHOULD_STOP_COMPOSITE ]; then
    # Delete the job named $PM2_JOB_NAME.
    npm list -g | grep pm2
    if [ $? -eq 0 ]; then
        pm2 delete $PM2_JOB_NAME
    else
        echo "PM2 does not exist."
        exit 1;
    fi
fi

