
GIT = git
NPM = npm

GRUNT = ./node_modules/.bin/grunt
BOWER = ./node_modules/.bin/bower

all: test-once compile docs

compile: compile-theme


compile-theme:
	mkdir -p dist
	NODE_PATH=./node_modules $(GRUNT) compile-theme

bootstrap: clean
	mkdir -p dist
	$(NPM) link --prefix=./node_modules
	NODE_PATH=./node_modules $(GRUNT) sed:bootstrap
	$(BOWER) install

jshint:
	NODE_PATH=./node_modules $(GRUNT) jshint

test:
	NODE_PATH=./node_modules $(GRUNT) test --force --pattern=$(pattern)

test-once:
	NODE_PATH=./node_modules $(GRUNT) test_once --force --pattern=$(pattern)

test-dev:
	NODE_PATH=./node_modules $(GRUNT) test_dev --force --pattern=$(pattern)

test-ci:
	NODE_PATH=./node_modules $(GRUNT) test_ci

docs:
	if test ! -d docs; then $(GIT) clone git://github.com/plone/mockup.git -b gh-pages docs; fi
	rm -rf docs/dev
	NODE_PATH=./node_modules $(GRUNT) docs

docs-publish:
	echo -e "Starting to update gh-pages\n"; cd docs; ls -la; git add -fA .; git commit -m "Travis build $(TRAVIS_BUILD_NUMBER) pushed to gh-pages"; git push -fq https://$(GH_TOKEN)@github.com/plone/mockup.git gh-pages > /dev/null; cd ..;

clean:
	mkdir -p dist
	rm -rf dist
	rm -rf node_modules
	rm -rf bower_components

clean-all: clean
	if test -f $(BOWER); then $(BOWER) cache clean; fi

.PHONY: compile bootstrap jshint test test-ci docs clean