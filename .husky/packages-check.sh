#!/bin/sh

if git diff --name-only HEAD@{1} HEAD | grep "^package.json" > /dev/null 2>&1 ; then
  echo "'package.json' has changed. Running 'yarn install' to update your dependencies..."
  yarn install
fi

yarn --cwd ./shared-code run build