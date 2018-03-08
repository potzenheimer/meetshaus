import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();

var cfg = require('./../config.json');


gulp.task('replace:server', () => {
    return gulp.src(cfg.paths.base + cfg.paths.dev + '/{,*/}*.html')
        .pipe($.replaceTask({
            patterns: cfg.replacementPatterns.server,
            usePrefix: false,
            preserveOrder: true
        }))
        .pipe(gulp.dest(cfg.paths.base + cfg.paths.dev))
});


gulp.task('replace:pat', () => {
    return gulp.src(cfg.paths.base + cfg.paths.dev + '/{,*/}*.html')
        .pipe($.replaceTask({
            patterns: cfg.replacementPatterns.pat,
            usePrefix: false,
            preserveOrder: true
        }))
        .pipe(gulp.dest(cfg.paths.base + cfg.paths.dev))
});
