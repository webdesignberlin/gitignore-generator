module.exports = function(grunt) {
    'use strict';


    /* + Global Project Vars */
    // Usage: <%= globalConfig.var %>
    var globalConfig = {
        root: '.',
        bower: 'bower_components',
        temp: 'web/assets-temp',
        src:  'web/assets-dev',
        dest: 'web/assets'
    };
    /* = Global Project Vars */


    /* + Preparation */
    require('load-grunt-tasks')(grunt); // Load all grunt tasks matching the `grunt-*` pattern
    grunt.util.linefeed = '\n'; // Force use of Unix newlines
    /* = Preparation */

    /* + Project Tasks */
    grunt.initConfig({
        globalConfig: globalConfig, // include Global Config
        pkg: grunt.file.readJSON('package.json'), // Get npm package data

        /**
         * + Task Config: Clean
         * ================================================================== */
        clean: {
            // temporary files
            temp: [
                ['<%= globalConfig.temp %>']
            ],
            // dependencies / vendor folders
            deps: [
                ['<%= globalConfig.dest %>/js/vendor/**/*'],
                ['<%= globalConfig.dest %>/css/vendor/**/*'],
                ['<%= globalConfig.src %>/js/vendor/**/*'],
                ['<%= globalConfig.src %>/css/vendor/**/*']
            ]
        },
        /* = Task Config: Clean */


        /**
         * + Task Config: Copy dependency files
         * ================================================================== */
        copy: {

            // local jquery alternative
            gitignore: {
                expand: true,
                src: '<%= globalConfig.bower %>/gitignore/*',
                dest: '<%= globalConfig.root %>/web/templates/gitignore/',
                flatten: true
            }


        },
        /* = Task Config: Copy dependency files */


        /**
         * + Task config: Update json
         * ================================================================== */
        update_json: {
            bower: {
                src: 'package.json',
                dest: 'bower.json',
                fields: [
                    'name',
                    'version'
                ]
            }
        },
        /* = Task config: Update json */


        /**
         * + Task Config: Concatenation
         * ================================================================== */
        concat: {
        },
        /* = Task Config: Concatenation */


        /**
         * + Task Config: SASS
         * ================================================================== */
        sass: {
            options : {
                precision: 10,
                sourcemap: false, // disabled, as sourcemaps will be messed up by cmq and cssmin
                trace: false,
                unixNewlines: true,
                cacheLocation: '<%= globalConfig.root %>/.sass-cache'
            },
            styles: {
                files: [{
                    src: '<%= globalConfig.src %>/css/main.scss',
                    dest: '<%= globalConfig.temp %>/css/main.css'
                }]
            }
        },
        /* = Task Config: SASS */


        /**
         * + Task Config: Autoprefixer
         * ================================================================== */
        autoprefixer: {
            options: {
                browsers: [ // @https://github.com/postcss/autoprefixer#browsers
                    'last 2 versions',
                    '> 3%',
                    'Opera 12.1',
                    'Firefox ESR'
                ],
                map: false // not supported by cssmin
            },
            styles: {
                src: '<%= globalConfig.temp %>/css/main.css',
                dest: '<%= globalConfig.temp %>/css/main.css'
            }
        },
        /* = Task Config: Autoprefixer */


        /**
         * + Task Config: Combine Media Queries
         * ================================================================== */
        cmq: {
            options: {
                log: true
            },
            styles: {
                files: {
                    '<%= globalConfig.temp %>/css/combined-media-queries/': [
                        '<%= globalConfig.temp %>/css/main.css'
                    ]
                }
            }
        },
        /* = Task Config: Combine Media Queries */


        /**
         * + Task Config: CSSMin
         * ================================================================== */
        cssmin: {
            styles: {
                files: {
                    '<%= globalConfig.dest %>/css/main.min.css': [
                        '<%= globalConfig.temp %>/css/combined-media-queries/main.css'
                    ]
                }
            }
        },
        /* = Task Config: CSSMin */


        /**
         * + Task Config: JSHint
         * ================================================================== */
        jshint: {
            options: {
                'indent'   : 4,
                'quotmark' : 'single'
            },
            scripts: {
                src: '<%= globalConfig.src %>/js/main.js'
            },
            grunt: {
                src: 'Gruntfile.js'
            }
        },
        /* = Task Config: JSHint */


        /**
         * + Task Config: Uglify
         * ================================================================== */
        uglify: {
            options: {
                sourceMap: true,
                sourceMapName: '<%= globalConfig.temp %>/js/main.js.map',
                sourceMapIncludeSources: true
            },
            scripts: {
                files: {
                    '<%= globalConfig.dest %>/js/main.min.js': [
                        '<%= globalConfig.src %>/js/main.js'
                    ]
                },
            }
        },
        /* = Task Config: Uglify */


        /**
         * + Task Config: Browser Sync
         * ================================================================== */
        browserSync: {
            elena: {
                bsFiles: {
                    src : ['web/*']
                },
                options: {
                    //proxy: "frontend.mg.code.bytenetz.de",
                    //watchTask: true,
                    ghostMode: {
                        clicks: true,
                        location: true,
                        forms: true,
                        scroll: true
                    },

                    server: {
                        baseDir: 'web',
                        directory: true
                    }
                }
            }
        },
        /* = Task Config: Browser Sync */


        /**
         * + Task Config: Watch
         * ================================================================== */
        watch: {
            options: {
                livereload: false
            },
            json: {
                files: [
                    'package.json'
                ],
                tasks: [
                    'build-json'
                ]
            },
            styles: {
                files: [
                    '<%= globalConfig.src %>/css/*.scss',
                    '<%= globalConfig.src %>/css/**/*.scss',
                    '<%= globalConfig.src %>/css/*.css',
                    '<%= globalConfig.src %>/css/**/*.css'
                ],
                tasks: [
                    'build-css'
                ]
            },
            scripts: {
                files: [
                    '<%= globalConfig.src %>/js/*.js',
                    '<%= globalConfig.src %>/js/**/*.js'
                ],
                tasks: [
                    'build-js'
                ]
            },
            grunt: {
                files: [
                    'Gruntfile.js'
                ],
                tasks: [
                    'jshint:grunt'
                ]
            }
        },
        /* = Task Config: Watch */


    });
    /* = Project Configuration */


    /**
     * + Custom Task Definitions
     * ================================================================== */
    // copy dependencies
    grunt.registerTask( 'copy-deps', [
        'clean:deps',
        'copy'
    ]);
    // clean temporary files/folders
    grunt.registerTask( 'clean-temp', [
        'clean:temp'
    ]);
    // process stylesheets
    grunt.registerTask( 'build-css', [
        // 'clean:css',
        'sass:styles',
        'autoprefixer:styles',
        'cmq:styles',
        'cssmin:styles'
    ]);
    // process javascripts
    grunt.registerTask( 'build-js', [
        // 'clean:js',
        //'jshint:scripts',
        'uglify:scripts'
    ]);
    // process everything
    grunt.registerTask( 'build', [
        'update_json:bower',
        'copy-deps',
        'build-css',
        'build-js',
        'clean:temp'
    ]);
    // start sync and watch
    grunt.registerTask( 'sync', [
        'browserSync',
        'watch'
    ]);
    // build job as default
    grunt.registerTask( 'default', [
        'build'
    ]);
    /* = Custom Task Definitions */


};
