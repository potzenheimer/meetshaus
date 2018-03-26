import gulp from 'gulp';
import del from 'del';
import revDel from 'rev-del';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();

var cfg = require('./../config.json');
var fs = require('fs');


gulp.task('revision:styles', () => {
    if (fs.existsSync(cfg.paths.base + cfg.paths.dist + 'styles/rev-manifest.json')) {
        var manifest = fs.readFileSync(cfg.paths.base + cfg.paths.dist + 'styles/rev-manifest.json', 'utf8')
        del.sync(Object.values(JSON.parse(manifest)), {'cwd': cfg.paths.base + cfg.paths.dist + 'styles/'})
    }
    return gulp.src(cfg.paths.base + cfg.paths.dist + 'styles/*.min.css')
        .pipe($.rev())
        .pipe(gulp.dest(cfg.paths.base + cfg.paths.dist + 'styles'))
        .pipe($.rev.manifest())
        .pipe(revDel({dest: cfg.paths.base + cfg.paths.dist + 'styles'}))
        .pipe(gulp.dest(cfg.paths.base + cfg.paths.dist + 'styles'))
}
)
;

gulp.task('revision:scripts', () => {
    return gulp.src(cfg.paths.base + cfg.paths.dist + 'scripts/' + pkg.name + 'min.js')
        .pipe($.rev())
        .pipe(gulp.dest(cfg.paths.base + cfg.paths.dist + 'scripts'))
        .pipe($.rev.manifest())
        .pipe(revDel({dest: cfg.paths.base + cfg.paths.dist + 'scripts'}))
        .pipe(gulp.dest(cfg.paths.base + cfg.paths.dist + 'scripts'))
}
)
;
