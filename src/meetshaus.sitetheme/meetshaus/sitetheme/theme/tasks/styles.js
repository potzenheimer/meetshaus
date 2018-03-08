import gulp from 'gulp';
import revDel from 'rev-del';
import {create as bsCreate} from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();
const browserSync = bsCreate();


var cfg = require('./../config.json');
var pkg = require('./../package.json');

// Styles build task
gulp.task('styles', () => {
    return gulp.src(cfg.paths.base + cfg.paths.app + 'sass/main.scss')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: [cfg.paths.base + cfg.paths.src]
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({browsers: ['last 1 version']}))
        //.pipe($.csscomb())
        .pipe(gulp.dest(cfg.paths.base + cfg.paths.dist + 'styles/'))
        .pipe($.cssnano())
        .pipe($.rename({
            basename: pkg.name,
            suffix: '.min'
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(cfg.paths.base + cfg.paths.dist + 'styles/'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('styles:cb', () => {
    return gulp.src(cfg.paths.base + cfg.paths.dist + 'styles/*.min.css')
        .pipe($.rev())
        .pipe(gulp.dest(cfg.paths.base + cfg.paths.dist + 'styles'))
        .pipe($.rev.manifest())
        .pipe(revDel({dest: cfg.paths.base + cfg.paths.dist + 'styles'}))
        .pipe(gulp.dest(cfg.paths.base + cfg.paths.dist + 'styles'))
}
)
;
