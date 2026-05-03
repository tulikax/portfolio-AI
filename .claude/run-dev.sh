#!/bin/sh
export PATH="/Users/tulika/.nvm/versions/node/v24.12.0/bin:$PATH"
cd "$(git rev-parse --show-toplevel)"
exec npm run dev
