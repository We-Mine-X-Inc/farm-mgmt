#!/bin/bash
cd /home/ubuntu/applications/farm-mgmt

$(dirname $(nvm which current))/npm install
$(dirname $(nvm which current))/npm run deploy:$NODE_ENV