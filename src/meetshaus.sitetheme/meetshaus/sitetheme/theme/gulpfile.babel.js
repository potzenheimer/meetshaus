'use strict'
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import {create as bsCreate} from 'browser-sync';
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

// Load configuration
var cfg = require('./config.json');



/*
 * TASKS
 *
 */

// Browser sync
gulp.task('bs:reload', function (done) {
    browserSync.reload();
    done();
});

gulp.task('bs:reload:styles', ['styles:dist'], function() {
    return global.browserSync.reload('*.css');
});


// Development tasks
gulp.task('dev:serve', ['build:dist:base'], () => {
    browserSync.init({
        notify: false,
        port: 9499,
        server: {
            baseDir: [cfg.paths.dist]
        }
    });

    gulp.watch([
        cfg.paths.dist + '/*.html',
        cfg.paths.dist + '/scripts/*.js',
        cfg.paths.dist + '/styles/*.css',
    ]).on('change', browserSync.reload);

    gulp.watch(cfg.paths.app + "sass/**/*.scss", ['styles:dist']);
    gulp.watch(cfg.paths.app + "scripts/**/*.js", ['collect:scripts:app']);
    gulp.watch(cfg.paths.app + "**/*.html", ['jekyll:build', 'collect:html', 'bs:reload']);
});

gulp.task('dev:serve:background', function () {
    browserSync.init({
        notify: false,
        port: 9499,
        open: false,
        server: {
            baseDir: [cfg.paths.dist]
        }
    });
    gulp.watch([
        cfg.paths.dist + '/*.html',
        cfg.paths.dist + '/scripts/*.js',
        cfg.paths.dist + '/styles/*.css',
    ]).on('change', browserSync.reload);

    gulp.watch(cfg.paths.app + "sass/**/*.scss", ['styles:dist']);
    gulp.watch(cfg.paths.app + "scripts/**/*.js", ['collect:scripts:app']);
    gulp.watch(cfg.paths.app + "**/*.html", ['jekyll:build', 'collect:html', 'bs:reload']);
});


gulp.task('dev:watch', ['dev:browser-sync'], function () {
    gulp.watch(cfg.paths.app + "sass/**/*.scss", ['styles:dist']);
    gulp.watch(cfg.paths.app + "scripts/**/*.js", ['collect:scripts:app']);
    gulp.watch(cfg.paths.app + "**/*.html", ['jekyll:build', 'collect:html', 'bs:reload']);
});

gulp.task('dev:watch:styles', function () {
    gulp.watch(cfg.paths.app + "sass/**/*.scss", ['bs:reload:styles']);
});


// Build tasks
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

gulp.task('build:dist:base', function(done) {
    runSequence(
        'build:base:dist',
        'replace:base',
        'revision:styles',
        'replace:revision:styles',
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


// Base tasks

// Clean distribution directory and start over
gulp.task('init', ['build:init']);

// Run development build
gulp.task('develop', ['build:dev']);

// Build distribution versions of styles and scripts
gulp.task('dist', ['build:dist:base']);

// Rebuild whole theme for distribution
gulp.task('build', ['build:dist:full']);

// Development build usable with standalone Plone backend
gulp.task('pat', ['build:pat']);

// Development Server
gulp.task('serve', ['dev:serve']);

gulp.task('watch', ['dev:watch'])

// Start working with the styles
gulp.task('default', ['dev:watch:styles']);

