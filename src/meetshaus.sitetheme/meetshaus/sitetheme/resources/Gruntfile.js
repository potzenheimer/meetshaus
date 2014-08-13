/* jshint node: true */
'use strict';

module.exports = function (grunt) {

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Project configuration.
    grunt.initConfig({

        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
                  '* Meetshaus v<%= pkg.version %> by meetshaus\n' +
                  '* Copyright <%= pkg.author %>\n' +
                  '* Licensed under <%= pkg.licenses %>.\n' +
                  '*\n' +
                  '* Designed and built by ade25\n' +
                  '*/\n',
        jqueryCheck: 'if (typeof jQuery === "undefined") { throw new Error("Bootstrap requires jQuery") }\n\n',

        // Task configuration.
        clean: {
            dist: ['dist']
        },

        jshint: {
            options: {
                jshintrc: 'js/.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            src: {
                src: ['js/*.js']
            },
            test: {
                src: ['js/tests/unit/*.js']
            }
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
                    'bower_components/bootstrap/dist/js/bootstrap.js',
                    'bower_components/isotope/jquery.isotope.js',
                    'bower_components/headroom.js/dist/headroom.js',
                    'bower_components/headroom.js/dist/jQuery.headroom.js',
                    'js/application.js'
                ],
                dest: 'dist/js/<%= pkg.name %>.js'
            },
            theme: {
                src: [
                    'bower_components/bootstrap/dist/js/bootstrap.js',
                    'bower_components/isotope/jquery.isotope.js',
                    'bower_components/headroom.js/dist/headroom.js',
                    'bower_components/headroom.js/dist/jQuery.headroom.js',
                    'js/application.js'
                ],
                dest: 'dist/js/application.js'
            }
        },

    less: {
      compileTheme: {
        options: {
          strictMath: false,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
        },
        files: {
          'dist/css/<%= pkg.name %>.css': 'less/styles.less'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: [
          'Android 2.3',
          'Android >= 4',
          'Chrome >= 20',
          'Firefox >= 24', // Firefox 24 is the latest ESR
          'Explorer >= 8',
          'iOS >= 6',
          'Opera >= 12',
          'Safari >= 6'
        ]
      },
      core: {
        options: {
          map: true
        },
        src: 'dist/css/<%= pkg.name %>.css'
      }
    },

    csslint: {
      options: {
        csslintrc: 'less/.csslintrc'
      },
      src: 'dist/css/<%= pkg.name %>.css'
    },

    cssmin: {
      options: {
        compatibility: 'ie8',
        keepSpecialComments: '*',
        noAdvanced: true
      },
      core: {
        files: {
          'dist/css/<%= pkg.name %>.min.css': 'dist/css/<%= pkg.name %>.css'
        }
      }
    },

    csscomb: {
      sort: {
        options: {
          config: 'less/.csscomb.json'
        },
        files: {
          'dist/css/<%= pkg.name %>.css': ['dist/css/<%= pkg.name %>.css']
        }
      }
    },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: ['<%= concat.dist.dest %>'],
                dest: 'dist/js/<%= pkg.name %>.min.js'
            }
        },

        copy: {
            fonts: {
                expand: true,
                flatten: true,
                cwd: 'bower_components/',
                src: ['font-awesome/fonts/*'],
                dest: 'assets/fonts/'
            },
            staticfonts: {
                expand: true,
                flatten: true,
                src: ['assets/fonts/*'],
                dest: 'dist/assets/fonts/'
            },
            ico: {
                expand: true,
                flatten: true,
                src: ['assets/ico/*'],
                dest: 'dist/assets/ico/'
            },
            images: {
                expand: true,
                flatten: true,
                src: ['assets/img/*'],
                dest: 'dist/assets/img/'
            },
            templates: {
                expand: true,
                flatten: true,
                src: ['_site/*.html'],
                dest: 'dist/'
            }
        },
        imagemin: {
            theme: {
                files: [{
                    expand: true,
                    cwd: 'assets/img/',
                    src: ['*.{png,jpg,gif}'],
                    dest: 'dist/img'
                }]
            }
        },
        rev: {
            options:  {
                algorithm: 'sha256',
                length: 8
            },
            files: {
                src: ['dist/**/*.{js,css,png,jpg}']
            }
        },
        qunit: {
            options: {
                inject: 'js/tests/unit/phantom.js'
            },
            files: ['js/tests/*.html']
        },

        connect: {
            server: {
                options: {
                    port: 3000,
                    base: '.'
                }
            }
        },
        jekyll: {
            theme: {}
        },

        htmlmin: {
          dist: {
            options: {
              removeComments: true,
              collapseWhitespace: true
            },
            files: {
              'dist/index.html': '_site/index.html',
              'dist/signin.html': '_site/signin/index.html',
              'dist/frontpage.html': '_site/frontpage/index.html',
              'dist/fullscreen.html': '_site/references/index.html',
            }
          },
        },

        sed: {
            cleanSourceAssets: {
                path: 'dist/',
                pattern: '../../assets/',
                replacement: '../assets/',
                recursive: true
            },
            cleanCSSFrontpage: {
              path: 'dist/',
              pattern: '../../dist/css/<%= pkg.name %>.min.css',
              replacement: 'dist/css/<%= pkg.name %>.min.css',
              recursive: true
            },
            cleanCSS: {
              path: 'dist/',
              pattern: '../dist/css/<%= pkg.name %>.min.css',
              replacement: 'dist/css/<%= pkg.name %>.min.css',
              recursive: true
            },
            cleanJS: {
              path: 'dist/',
              pattern: '../dist/js/<%= pkg.name %>.min.js',
              replacement: 'dist/js/<%= pkg.name %>.min.js',
              recursive: true
            },
            cleanJSFrontpage: {
              path: 'dist/',
              pattern: '../../dist/js/<%= pkg.name %>.min.js',
              replacement: 'dist/js/<%= pkg.name %>.min.js',
              recursive: true
            },
            // cleanFPSourceJS: {
            //     path: 'dist/',
            //     pattern: '../../dist/js/meetshaus.min.js',
            //     replacement: '/++theme++meetshaus.sitetheme/dist/js/meetshaus.min.js',
            //     recursive: true
            // },
            cleanImgPath: {
                path: 'dist/index.html',
                pattern: '../assets/img/',
                replacement: 'assets/img/',
            },
            cleanImgPathFrontpage: {
                path: 'dist/frontpage.html',
                pattern: '../assets/img/',
                replacement: 'assets/img/',
            },
            cleanImgPathSignin: {
                path: 'dist/signin.html',
                pattern: '../assets/img/',
                replacement: 'assets/img/',
            }
        },
        validation: {
            options: {
                reset: true
            },
            files: {
                src: ['_gh_pages/**/*.html']
            }
        },

        watch: {
            src: {
                files: '<%= jshint.src.src %>',
                tasks: ['jshint:src', 'qunit']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'qunit']
            },
            recess: {
                files: 'less/*.less',
                tasks: ['recess']
            },
            templates: {
                files: '*.html',
                tasks: ['jekyll:theme']
            }
        }
    });

    // -------------------------------------------------
    // These are the available tasks provided
    // Run them in the Terminal like e.g. grunt dist-css
    // -------------------------------------------------

    // Prepare distrubution
    grunt.registerTask('dist-init', '', function () {
        grunt.file.mkdir('dist/assets/');
    });

    // Docs HTML validation task
    grunt.registerTask('validate-html', ['jekyll', 'validation']);

    // Javascript Unittests
    grunt.registerTask('unit-test', ['qunit']);

    // Test task.
    var testSubtasks = ['dist-css', 'jshint', 'validate-html'];

    grunt.registerTask('test', testSubtasks);

    // JS distribution task.
    grunt.registerTask('dist-js', ['concat', 'uglify']);

    // CSS distribution task.
    grunt.registerTask('less-compile', ['less:compileTheme']);
    grunt.registerTask('dist-css', ['less-compile', 'autoprefixer', 'csscomb', 'cssmin']);

    // Assets distribution task.
    grunt.registerTask('dist-assets', ['newer:copy', 'newer:imagemin']);

    // Cache buster distribution task.
    grunt.registerTask('dist-cb', ['rev']);

    // Template distribution task.
    grunt.registerTask('dist-html', ['jekyll:theme', 'htmlmin', 'sed']);

    // Concurrent distribution task
    grunt.registerTask('dist-cc', ['test', 'concurrent:cj', 'concurrent:ha']);

    // Development task.
    grunt.registerTask('dev', ['less-compile', 'dist-js', 'dist-html']);

    // Full distribution task.
    grunt.registerTask('dist', ['clean', 'dist-css', 'dist-js', 'dist-html', 'dist-assets']);

    // Shim theme compilation alias
    grunt.registerTask('compile-theme', ['dist']);

    // Default task.
    grunt.registerTask('default', ['dev']);
};