'use strict'
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import {create as bsCreate} from 'browser-sync';
import {styles} from "./tasks/styles";

var HubRegistry = require('gulp-hub');

/* load some files into the registry */
var hub = new HubRegistry([
    './tasks/clean.js',
    './tasks/collect.js',
    './tasks/favicon.js',
    './tasks/jekyll.js',
    './tasks/styles.js',
    './tasks/inject.js',
    './tasks/revision.js',
    './tasks/replace.js'
]);

/* tell gulp to use the tasks just loaded */
gulp.registry(hub);


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



// Build tasks
// gulp.task('build:init', function(done) {
//     runSequence(
//         'clean:dist',
//         ['collect:fonts', 'collect:images', 'collect:scripts:vendor'],
//         done);
// });

const buildInit = gulp.series(
    'clean:dist',
    gulp.parallel('collect:fonts', 'collect:images', 'collect:scripts:vendor')
);

buildInit.description = 'Delete distribution and collect fresh copies of static assets';

gulp.task('build:init', buildInit);

// gulp.task('build:collect', function(done) {
//     runSequence(
//         ['collect:fonts', 'collect:images', 'collect:scripts:vendor'],
//         done);
// });
const buildCollect = gulp.parallel(
    'collect:fonts', 'collect:images', 'collect:scripts:vendor'
);
buildCollect.description = 'Collect static assets for production build';

gulp.task('build:collect', buildCollect);

// Base tasks

// Clean distribution directory and start over
// gulp.task('init', function(done) {
//     runSequence(
//         'build:init',
//         'build:base',
//         done);
// });

// Run development build
// gulp.task('develop', ['build:dev']);

// Build distribution versions of styles and scripts
// gulp.task('dist', ['build:dist:base']);

// Rebuild whole theme for distribution
// gulp.task('build', ['build:dist:full']);

// Development build usable with standalone Plone backend
// gulp.task('pat', ['build:pat']);

// Development Server
// gulp.task('serve', ['dev:serve']);

// gulp.task('watch', ['dev:watch'])

// Start working with the styles
// gulp.task('default', ['dev:watch:styles']);

