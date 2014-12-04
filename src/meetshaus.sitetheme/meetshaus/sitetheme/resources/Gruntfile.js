module.exports = function (grunt) {
    'use strict';
    require('time-grunt')(grunt);
    require('jit-grunt')(grunt);
    var config = {
        app: 'app',
        dev: '_site',
        dist: 'dist'
    };
    grunt.initConfig({
        config: config,
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' + '* <%= pkg.name %> v<%= pkg.version %> by Ade25\n' + '* Copyright <%= pkg.author %>\n' + '* Licensed under <%= pkg.licenses %>.\n' + '*\n' + '* Designed and built by ade25\n' + '*/\n',
        jqueryCheck: 'if (typeof jQuery === "undefined") { throw new Error("We require jQuery") }\n\n',
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: ['<%= config.dist %>']
                }]
            },
            server: {
                files: [{
                    dot: true,
                    src: [
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/assets'
                    ]
                }]
            }
        },
        jshint: {
            options: { jshintrc: 'js/.jshintrc' },
            grunt: { src: 'Gruntfile.js' },
            src: { src: ['js/*.js'] }
        },
        jscs: {
            options: { config: 'js/.jscsrc' },
            grunt: { src: '<%= jshint.grunt.src %>' },
            src: { src: '<%= jshint.src.src %>' }
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: false
            },
            dist: {
                src: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/modernizr/modernizr.js',
                    'bower_components/imagesloaded/imagesloaded.pkgd.js',
                    'bower_components/isotope/dist/isotope.pkgd.js',
                    'bower_components/owl.carousel/dist/owl.carousel.js',
                    'js/main.js'
                ],
                dest: '<%= config.dist %>/js/<%= pkg.name %>.js'
            },
            theme: {
                src: [
                    'bower_components/bootstrap/js/transition.js',
                    'bower_components/bootstrap/js/collapse.js',
                    'bower_components/bootstrap/js/dropdown.js',
                    'bower_components/owl.carousel/dist/owl.carousel.js',
                    'js/main.js'
                ],
                dest: '<%= config.dist %>/js/main.js'
            }
        },
        uglify: {
            options: { banner: '<%= banner %>' },
            dist: {
                src: ['<%= concat.dist.dest %>'],
                dest: '<%= config.dist %>/js/<%= pkg.name %>.min.js'
            }
        },
        less: {
            compileTheme: {
                options: {
                    strictMath: false,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: '<%= pkg.name %>.css.map',
                    sourceMapFilename: '<%= config.dev %>/css/<%= pkg.name %>.css.map'
                },
                files: { '<%= config.dev %>/css/<%= pkg.name %>.css': 'less/styles.less' }
            }
        },
        autoprefixer: {
            options: {
                browsers: [
                    'Android 2.3',
                    'Android >= 4',
                    'Chrome >= 20',
                    'Firefox >= 24',
                    'Explorer >= 8',
                    'iOS >= 6',
                    'Opera >= 12',
                    'Safari >= 6'
                ]
            },
            core: {
                options: { map: true },
                src: '<%= config.dev %>/css/<%= pkg.name %>.css'
            }
        },
        csslint: {
            options: { csslintrc: 'less/.csslintrc' },
            src: '<%= config.dev %>/css/<%= pkg.name %>.css'
        },
        csscomb: {
            sort: {
                options: { config: 'less/.csscomb.json' },
                files: { '<%= config.dev %>/css/<%= pkg.name %>.css': ['<%= config.dev %>/css/<%= pkg.name %>.css'] }
            }
        },
        cssmin: {
            options: {
                compatibility: 'ie8',
                keepSpecialComments: '*',
                noAdvanced: true
            },
            core: { files: { '<%= config.dist %>/css/<%= pkg.name %>.min.css': '<%= config.dev %>/css/<%= pkg.name %>.css' } }
        },
        criticalcss: {
            frontpage: {
                options: {
                    url: 'http://localhost:8499',
                    width: 1200,
                    height: 900,
                    outputfile: '<%= config.dev %>/css/critical.css',
                    filename: '<%= pkg.name %>.min.css'
                }
            }
        },
        copy: {
            fontawesome: {
                expand: true,
                flatten: true,
                cwd: 'bower_components/',
                src: ['font-awesome/fonts/*'],
                dest: '<%= config.dist %>/assets/fonts/'
            },
            ionicons: {
                expand: true,
                flatten: true,
                cwd: 'bower_components/',
                src: ['ionicons/fonts/*'],
                dest: '<%= config.dist %>/assets/fonts/'
            },
            ico: {
                expand: true,
                flatten: true,
                src: ['assets/ico/*'],
                dest: '<%= config.dist %>/assets/ico/'
            }
        },
        imagemin: {
            png: {
                options: { optimizationLevel: 7 },
                files: [{
                    expand: true,
                    cwd: 'assets/img',
                    src: ['**/*.png'],
                    dest: '<%= config.dist %>/assets/img/',
                    ext: '.png'
                }]
            },
            jpg: {
                options: { progressive: true },
                files: [{
                    expand: true,
                    cwd: 'assets/img/',
                    src: ['**/*.jpg'],
                    dest: '<%= config.dist %>/assets/img/',
                    ext: '.jpg'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'assets/img/',
                    src: '{,*/}*.svg',
                    dest: '<%= config.dist %>/assets/img/'
                }]
            }
        },
        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 8
            },
            styles: {
                src: ['<%= config.dist %>/css/{,*/}*.css'],
                dest: '<%= config.dist %>/css'
            }
        },
        filerev_replace: {
            options: { assets_root: '<%= config.dev %>' },
            views: {
                options: { views_root: '<%= config.dev %>' },
                src: '<%= config.dev %>/{,*/}*.html'
            }
        },
        qunit: {
            options: { inject: 'js/tests/unit/phantom.js' },
            files: ['js/tests/*.html']
        },
        jekyll: {
            theme: { options: { config: '_config.yml' } },
            server: {
                options: {
                    serve: true,
                    server_port: 8000,
                    auto: true
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.dev %>',
                    src: [
                        '*.html',
                        '{,*/}*.html'
                    ],
                    dest: '<%= config.dist %>'
                }]
            }
        },
        replace: {
            dev: {
                options: {
                    patterns: [
                        {
                            match: '../../assets/',
                            replacement: 'assets/'
                        },
                        {
                            match: '../assets/',
                            replacement: 'assets/'
                        },
                        {
                            match: '../../<%= config.dist %>/css/<%= pkg.name %>.min.css',
                            replacement: 'css/<%= pkg.name %>.min.css'
                        },
                        {
                            match: '../<%= config.dist %>/css/<%= pkg.name %>.min.css',
                            replacement: 'css/<%= pkg.name %>.min.css'
                        },
                        {
                            match: '../../<%= config.dist %>/js/*.js',
                            replacement: 'js/<%= pkg.name %>.min.js'
                        },
                        {
                            match: '../<%= config.dist %>/js/<%= pkg.name %>.min.js',
                            replacement: 'js/<%= pkg.name %>.min.js'
                        }
                    ],
                    usePrefix: false,
                    preserveOrder: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.dev %>',
                    src: [
                        '*.html',
                        '{,*/}*.html'
                    ],
                    dest: '<%= config.dev %>'
                }]
            },
            dist: {
                options: {
                    patterns: [
                        {
                            match: '../../assets/',
                            replacement: '/++theme++<%= pkg.name %>.sitetheme/<%= config.dist %>/assets/'
                        },
                        {
                            match: '../assets/',
                            replacement: '/++theme++<%= pkg.name %>.sitetheme/<%= config.dist %>/assets/'
                        },
                        {
                            match: '../../<%= config.dist %>/js/<%= pkg.name %>.min.js',
                            replacement: '/++theme++<%= pkg.name %>.sitetheme/<%= config.dist %>/js/<%= pkg.name %>.min.js'
                        },
                        {
                            match: '../<%= config.dist %>/js/<%= pkg.name %>.min.js',
                            replacement: '/++theme++<%= pkg.name %>.sitetheme/<%= config.dist %>/js/<%= pkg.name %>.min.js'
                        },
                        {
                            match: '../../<%= config.dist %>/css/<%= pkg.name %>.css',
                            replacement: '/++theme++<%= pkg.name %>.sitetheme/<%= config.dist %>/css/<%= pkg.name %>.min.css'
                        },
                        {
                            match: '../<%= config.dist %>/css/<%= pkg.name %>.css',
                            replacement: '/++theme++<%= pkg.name %>.sitetheme/<%= config.dist %>/css/<%= pkg.name %>.min.css'
                        }
                    ],
                    usePrefix: false,
                    preserveOrder: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.dev %>',
                    src: [
                        '*.html',
                        '{,*/}*.html'
                    ],
                    dest: '<%= config.dev %>'
                }]
            }
        },
        validation: {
            options: {
                charset: 'utf-8',
                doctype: 'HTML5',
                failHard: true,
                reset: true,
                relaxerror: [
                    'Bad value X-UA-Compatible for attribute http-equiv on element meta.',
                    'Element img is missing required attribute src.'
                ]
            },
            files: { src: ['<%= config.dev %>/{,*/}*.html'] }
        },
        watch: {
            js: {
                files: ['js/{,*/}*.js'],
                tasks: ['newer:jshint:all'],
                options: { livereload: true }
            },
            styles: {
                files: ['<%= config.dev %>/styles/{,*/}*.css'],
                tasks: [
                    'newer:copy:styles',
                    'autoprefixer'
                ]
            },
            less: {
                files: 'less/*.less',
                tasks: ['less'],
                options: { spawn: false }
            },
            gruntfile: { files: ['Gruntfile.js'] },
            livereload: {
                options: { livereload: '<%= connect.options.livereload %>' },
                files: [
                    '<%= config.dev %>/{,*/}*.html',
                    '<%= config.dist %>/css/{,*/}*.css'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                hostname: 'localhost',
                livereload: 35729,
                base: '<%= config.dev %>'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= config.dist %>'
                    ]
                }
            },
            dist: { options: { base: '<%= config.dist %>' } }
        },
        concurrent: {
            cj: [
                'less',
                'copy',
                'concat',
                'uglify'
            ],
            ha: [
                'jekyll:theme',
                'copy-templates',
                'sed'
            ],
            dev: [
                'less:compileTheme',
                'jekyll:theme',
                'concat:dist'
            ]
        }
    });
    grunt.registerTask('dist-init', '', function () {
        grunt.file.mkdir('<%= config.dist %>/assets/');
    });
    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run([
                'build',
                'connect:dist:keepalive'
            ]);
        }
        grunt.task.run([
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });
    grunt.registerTask('validate-html', [
        'jekyll:theme',
        'validation'
    ]);
    grunt.registerTask('unit-test', ['qunit']);
    var testSubtasks = [
            'dist-css',
            'jshint',
            'validate-html'
        ];
    grunt.registerTask('test', testSubtasks);
    grunt.registerTask('dist-js', [
        'newer:concat',
        'newer:uglify'
    ]);
    grunt.registerTask('less-compile', ['less:compileTheme']);
    grunt.registerTask('dist-css', [
        'less-compile',
        'autoprefixer',
        'csscomb',
        'cssmin'
    ]);
    grunt.registerTask('dist-assets', [
        'newer:copy',
        'newer:imagemin'
    ]);
    grunt.registerTask('dist-cb', [
        'filerev',
        'filerev_replace'
    ]);
    grunt.registerTask('html', [
        'jekyll:theme'
    ]);
    grunt.registerTask('dist-html', [
        'jekyll:theme',
        'replace:dist',
        'htmlmin'
    ]);
    grunt.registerTask('dist-cc', [
        'test',
        'concurrent:cj',
        'concurrent:ha'
    ]);
    grunt.registerTask('dev', [
        'jekyll:theme',
        'less:compileTheme',
        'newer:concat:dist'
    ]);
    grunt.registerTask('dist', [
        'clean:server',
        'dist-css',
        'dist-js',
        'dist-html',
        'dist-assets'
    ]);
    grunt.registerTask('compile-theme', ['dist']);
    grunt.registerTask('default', ['dev']);
};