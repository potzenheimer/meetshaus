#!/bin/sh
virtualenv -p `which python2.7` .
env LDFLAGS="-L$(brew --prefix openssl)/lib" CFLAGS="-I$(brew --prefix openssl)/include" ./bin/pip install cryptography
./bin/pip install -r requirements.txt
./bin/buildout $*
echo "run plone with: b5 plone"
