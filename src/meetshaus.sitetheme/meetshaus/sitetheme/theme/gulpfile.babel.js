'use strict'
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import {create as bsCreate} from 'browser-sync';
import del from 'del';
import revDel from 'rev-del';
import args from 'yargs';
import hub from 'gulp-hub';

hub([
    './tasks/clean.js',
    './tasks/favicon.js',
    './tasks/jekyll.js',
    './tasks/collect.js',
    './tasks/replace.js',
    './tasks/revision.js',
    './tasks/inject.js',
    './tasks/styles.js',
    './tasks/scripts.js'
]);

const $ = gulpLoadPlugins();
const browserSync = bsCreate();

var runSequence = require('run-sequence');

var cp = require('child_process');
var es = require('event-stream');
var pkg = require('./package.json');
var cfg = require('./config.json');
var fs = require('fs');


gulp.task('dev:browser-sync', function () {
    browserSync.init({
        notify: false,
        port: 9499,
        server: {
            baseDir: ['.tmp', cfg.paths.dist],
            routes: {
                '/scripts': cfg.paths.dist + 'scripts',
                '/styles': cfg.paths.dist + 'styles',
                '/assets': cfg.paths.dist + 'assets',
            }
        }
    });
});

gulp.task('dev:bs-reload', function () {
    browserSync.reload();
});


gulp.task('dev:serve', ['build:dist:base'], () => {
    browserSync.init({
    notify: false,
    port: 9499,
    server: {
        baseDir: [cfg.paths.base + cfg.paths.dist]
    }
});

gulp.watch([
    cfg.paths.app + '/*.html',
    cfg.paths.app + '/scripts/*.js',
    cfg.paths.app + '/styles/*.css',
]).on('change', browserSync.reload);

gulp.watch(cfg.paths.app + "sass/**/*.scss", ['styles']);
gulp.watch(cfg.paths.app + "scripts/**/*.js", ['scripts']);
gulp.watch(cfg.paths.app + "{,*/}*.html", ['jekyll:build', 'html']);
});

gulp.task('default', ['dev:browser-sync'], function () {
    gulp.watch(cfg.paths.app + "sass/**/*.scss", ['styles']);
    gulp.watch(cfg.paths.app + "scripts/**/*.js", ['scripts']);
    gulp.watch(cfg.paths.app + "*.html", ['bs-reload']);
});


gulp.task('dev:watch:styles', ['styles'], function() {
  return global.browserSync.reload('*.css');
});


gulp.task('dev:watch', function () {
    gulp.watch(cfg.paths.app + "sass/**/*.scss", ['dev:watch:styles']);
});


gulp.task('build:init', function(done) {
    runSequence(
        'clean:dist',
        ['collect:fonts', 'collect:images', 'collect:scripts:vendor'],
        done);
});

gulp.task('build:collect', function(done) {
    runSequence(
        ['collect:fonts', 'collect:images', 'collect:scripts:vendor'],
        done);
});

gulp.task('build:base', function(done) {
    runSequence(
        ['jekyll:build', 'styles:dev', 'collect:scripts:app'],
        'inject:head:dev',
        done);
});

gulp.task('build:base:dist', function(done) {
    runSequence(
        ['jekyll:build', 'styles:dist', 'collect:scripts:app'],
        'inject:head:dist',
        done);
});

gulp.task('build:dev', function(done) {
    runSequence(
        'clean:dev',
        'build:collect',
        'build:base',
        'replace:base',
        'collect:html',
        done);
});

gulp.task('build:pat', function(done) {
    runSequence(
        'clean:dev',
        'build:collect',
        'build:base',
        'replace:pat',
        'collect:html',
        done);
});

gulp.task('build:dist:full', function(done) {
    runSequence(
        'build:init',
        'build:base:dist',
        'replace:base',
        'revision:styles',
        'replace:revision:styles',
        'collect:html',
        done);
});

gulp.task('build:dist:base', function(done) {
    runSequence(
        'build:base:dist',
        'replace:base',
        'revision:styles',
        'replace:revision:styles',
        'collect:html',
        done);
});

// Top level tasks
// Clean distribution directory and start over
gulp.task('init', ['build:init']);

// Run development build
gulp.task('develop', ['build:dev']);

// Development build usable with standalone Plone backend
gulp.task('pat', ['build:pat']);

// Build distribution versions of styles and scripts
gulp.task('dist', ['build:dist:base']);

// Rebuild whole theme for distribution
gulp.task('build', ['build:dist:full']);

// Start working with the styles
gulp.task('default', ['watch']);

