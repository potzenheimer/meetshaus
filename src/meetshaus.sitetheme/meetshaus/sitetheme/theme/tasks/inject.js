import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();

var pkg = require('./../package.json');
var cfg = require('./../config.json');


// Dev task for injecting the CSS into the HTML
gulp.task('inject:head:dev', () =>
    // Change the include file instead of all the HTML files
    gulp.src(cfg.paths.base + cfg.paths.dev + '**/*.html')
    // Look for any CSS files in the 'stylesheets' directory
    // Don't read the files for performance and ignore the base directory
    .pipe($.inject(gulp.src(cfg.paths.base + cfg.paths.dist + 'styles/**/*.css',
        {read: false}), {relative: true}, {ignorePath: '../' + cfg.paths.dist}))
    // Output the file back into it's directory
    .pipe(gulp.dest(cfg.paths.base + cfg.paths.dev))
);


// TODO: Finalize paths
// Dev task for injecting the CSS into the HTML
gulp.task('inject:head:dist', () =>
// Change the include file instead of all the HTML files
gulp.src(cfg.paths.base + cfg.paths.dev + '**/*.html')
// Look for any CSS files in the 'stylesheets' directory
// Don't read the files for performance and ignore the base directory
    .pipe($.inject(gulp.src(cfg.paths.base + cfg.paths.dist + 'styles/**/*.css',
        {read: false}),
        {relative: false},
        {removeTags: true},
        {ignorePath: '../' + cfg.paths.dist}
        ))
    // Output the file back into it's directory
    .pipe(gulp.dest(cfg.paths.base + cfg.paths.dev))
);
