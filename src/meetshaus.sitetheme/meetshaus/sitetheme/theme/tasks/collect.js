import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import {styles} from "./styles";
const $ = gulpLoadPlugins();

var es = require('event-stream');
var cfg = require('./../config.json');

var scriptSources = cfg.scripts.src;
var scriptSourcesApp = cfg.scripts.app;

export function collectVendorScripts() {
    return es.merge(scriptSources.map(function(obj) {
        return gulp.src(cfg.paths.base + cfg.paths.src + obj)
            .pipe($.plumber({
                errorHandler: function (error) {
                    console.log(error.message);
                    this.emit('end');
                }
            }))
            .pipe(gulp.dest(cfg.paths.base + cfg.paths.dist + 'scripts/'))
    }));
};

gulp.task('collect:scripts:vendor', collectVendorScripts);


export function collectAppScripts() {
    return es.merge(scriptSourcesApp.map(function(obj) {
        return gulp.src(cfg.paths.base + cfg.paths.app + obj)
            .pipe($.plumber({
                errorHandler: function (error) {
                    console.log(error.message);
                    this.emit('end');
                }
            }))
            .pipe(gulp.dest(cfg.paths.base + cfg.paths.dist + 'scripts/'))
    }));
};

gulp.task('collect:scripts:app', collectAppScripts);


export function collectImages() {
    return gulp.src(cfg.paths.base + cfg.paths.app + 'assets/images/**/*')
        .pipe($.if($.if.isFile, $.cache($.imagemin({
            progressive: true,
            interlaced: true,
            // don't remove IDs from SVGs, they are often used
            // as hooks for embedding and styling
            svgoPlugins: [{cleanupIDs: false}]
        }))
            .on('error', function (err) {
                console.log(err);
                this.end();
            })))
        .pipe(gulp.dest(cfg.paths.base + cfg.paths.dist + 'assets/images'));
};

gulp.task('collect:images', collectImages);

export function collectFonts() {
    return gulp.src(cfg.paths.base + cfg.paths.app + 'assets/fonts/**/*')
        .pipe(gulp.dest(cfg.paths.base + cfg.paths.dist + 'assets/fonts'));
};

collectFonts.description = 'Copy custom web fonts to distribution directory';

gulp.task('collect:fonts', collectFonts);

export function collectHtml() {
    return gulp.src(cfg.paths.base + cfg.paths.dev + '{,*/}*.html')
        .pipe($.minifyHtml())
        .pipe(gulp.dest(cfg.paths.base + cfg.paths.dist));
};

gulp.task('collect:html', collectHtml);
