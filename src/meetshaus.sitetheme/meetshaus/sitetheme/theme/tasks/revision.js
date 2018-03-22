import gulp from 'gulp';
import revDel from 'rev-del';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();

var cfg = require('./../config.json');


gulp.task('revision:styles', () => {
    return gulp.src(cfg.paths.base + cfg.paths.dist + 'styles/*.min.css')
        .pipe($.rev())
        .pipe(gulp.dest(cfg.paths.base + cfg.paths.dist + 'styles'))
        .pipe($.rev.manifest())
        .pipe(revDel({dest: cfg.paths.base + cfg.paths.dist + 'styles'}))
        .pipe(gulp.dest(cfg.paths.base + cfg.paths.dist + 'styles'))
}
)
;

gulp.task('revision:scripts, () => {
    return gulp.src(cfg.paths.base + cfg.paths.dist + 'scripts/' + pkg.name + 'min.js')
        .pipe($.rev())
        .pipe(gulp.dest(cfg.paths.base + cfg.paths.dist + 'scripts'))
        .pipe($.rev.manifest())
        .pipe(revDel({dest: cfg.paths.base + cfg.paths.dist + 'scripts'}))
        .pipe(gulp.dest(cfg.paths.base + cfg.paths.dist + 'scripts'))
}
)
;
