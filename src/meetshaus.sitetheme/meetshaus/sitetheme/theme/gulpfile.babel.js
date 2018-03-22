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


gulp.task('browser-sync', function () {
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

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});




gulp.task('serve', ['styles', 'scripts', 'jekyll:build', 'replace', 'html'], () => {
    browserSync.init({
    notify: false,
    port: 9499,
    server: {
        baseDir: ['.tmp', cfg.paths.dist],
        routes: {
            '/scripts': cfg.paths.dist + '/scripts',
            '/styles': cfg.paths.dist + '/styles',
            '/assets': cfg.paths.dist + '/assets',
        }
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

gulp.task('default', ['browser-sync'], function () {
    gulp.watch(cfg.paths.app + "sass/**/*.scss", ['styles']);
    gulp.watch(cfg.paths.app + "scripts/**/*.js", ['scripts']);
    gulp.watch(cfg.paths.app + "*.html", ['bs-reload']);
});


gulp.task('watch-styles', ['styles'], function() {
  return global.browserSync.reload('*.css');
});


gulp.task('watch', function () {
    gulp.watch(cfg.paths.app + "sass/**/*.scss", ['watch-styles']);
});


gulp.task('build:init', function(done) {
    runSequence(
        'clean:dist',
        ['collect:fonts', 'collect:images'],
        done);
});


gulp.task('build:dev', function(done) {
    runSequence(
        'clean:dev',
        ['collect:fonts', 'collect:images', 'collect:scripts:vendor'],
        ['jekyll:build', 'styles:dev', 'collect:scripts:app'],
        'inject:head:dev',
        'replace:base',
        'collect:html',
        done);
});

gulp.task('build:diazo', function(done) {
    runSequence(
        'clean:dev',
        ['collect:fonts', 'collect:images', 'collect:scripts:vendor'],
        ['jekyll:build', 'styles:dev', 'collect:scripts:app'],
        'inject:head:dev',
        'replace:pat',
        'collect:html',
        done);
});

gulp.task('build:production', function(done) {
    runSequence(
        'build:init',
        ['collect:fonts', 'collect:images', 'collect:scripts:vendor'],
        ['jekyll:build', 'styles:dist', 'collect:scripts:app'],
        'inject:head:dist',
        'revision:styles',
        'replace:revision:styles',
        'collect:html',
        done);
});

gulp.task('build:dist:full', function(done) {
    runSequence(
        ['jekyll:build', 'styles:dist', 'collect:scripts:app'],
        'inject:head:dist',
        'collect:html',
        done);
});

gulp.task('build:dist:base', function(done) {
    runSequence(
        ['styles:dist', 'collect:scripts:app'],
        'revision:styles',
        'replace:revision:styles',
        'collect:html',
        done);
});

// Top level tasks
gulp.task('init', ['build:init']);

gulp.task('develop', ['build:dev']);

gulp.task('dist', ['build:dist:base']);

gulp.task('build', ['build:dist:full']);

gulp.task('default', ['watch']);

