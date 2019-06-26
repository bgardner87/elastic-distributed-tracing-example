#!/bin/sh

set -e

yarn
(cd ./auth-service/db && node initializeDatabase.js)
nodemon --inspect=0.0.0.0 ./auth-service/index.js