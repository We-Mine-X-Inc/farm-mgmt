#!/bin/bash

# Variables
USER=ubuntu
LAUNCH_ENV=prod
APP_NAME=pool-switching
CONFIG_LOCATION=/home/$USER/applications/configs/.env.$LAUNCH_ENV.local
INITIAL_PUSH_LOCATION=/home/$USER/applications/farm-mgmt
DESTINATION_APP_LOCATION=/home/$USER/applications/$APP_NAME/$LAUNCH_ENV

sudo -s

# Move folder to environment specific folder.
mkdir -p $DESTINATION_APP_LOCATION
mv $INITIAL_PUSH_LOCATION $DESTINATION_APP_LOCATION
cd $DESTINATION_APP_LOCATION

# Copy environment specific config into directory.
cp $CONFIG_LOCATION $DESTINATION_APP_LOCATION

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

npm install
# npm run deploy:$LAUNCH_ENV