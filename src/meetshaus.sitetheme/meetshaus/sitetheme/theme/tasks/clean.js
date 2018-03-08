import gulp from 'gulp';
import del from 'del';

var cfg = require('./../config.json');

// Cleaning tasks
gulp.task('clean:dist', del.bind(null, [cfg.paths.base + cfg.paths.dist], {force: true}));
gulp.task('clean:dev', del.bind(null, [cfg.paths.base + cfg.paths.dev], {force: true}));
gulp.task('clean:assets', del.bind(null, ['.tmp', cfg.paths.base + cfg.paths.dist + 'assets']));
gulp.task('clean:metadata', del.bind(null, ['src/.jekyll-metadata'], {dot: true}));
