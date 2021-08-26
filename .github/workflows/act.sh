#!/bin/sh
act push -s GITHUB_SHA=1234 \
-s DIGITALOCEAN_ACCESS_TOKEN=$1 \
-W $( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/$2