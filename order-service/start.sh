#!/bin/sh

set -e

yarn
nodemon --inspect=0.0.0.0 ./order-service/index.js