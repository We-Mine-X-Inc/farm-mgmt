#!/bin/bash

# Note: This script is run for the current server being deployed. So instead of this being
# used immediately to stop the server currently in production, it is used for the current
# and will therefore not be executed until the next push.

su - ubuntu

SHOULD_STOP_SERVER=false
LAUNCH_ENV=prod
PM2_JOB_NAME=all_services_$LAUNCH_ENV # Defined within ecosystem.config.js

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

if [$SHOULD_STOP_SERVER]
    # If PM2 is loaded then delete the job that we are about to relaunch, by PM2_JOB_NAME
    npm list -g | grep pm2
    if [ $? -eq 0 ]; then
        pm2 delete $PM2_JOB_NAME
    else
        echo PM2 does not exist.
    fi
fi

