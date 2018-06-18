/// <reference path="lib/jquery/jquery.js" />
module.exports = function (grunt) {

   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks("grunt-bower-task");
   grunt.loadNpmTasks("grunt-contrib-concat");
   grunt.loadNpmTasks('grunt-contrib-cssmin');
   grunt.loadNpmTasks("grunt-ts");
   //grunt.loadNpmTasks("grunt-cache-control");
   grunt.loadNpmTasks("grunt-contrib-copy");
   grunt.loadNpmTasks("grunt-contrib-sass");
   //grunt.loadNpmTasks('grunt-tsd');
   grunt.loadNpmTasks('grunt-typings');

   grunt.initConfig({
      hash: '<%= ((new Date()).valueOf().toString()) + (Math.floor((Math.random()*1000000)+1).toString()) %>',
      ts: {
         default : {
            src: ["app/**/*.ts"],
            out: "public/javascripts/tuho.js",
            options: {
               sourceMaps: true
            }
         },
         tissi : {
            src: ["tissi/**/*.ts"],
            out: "public/javascripts/tissi.js",
            options: {
               sourceMaps: true
            }
         }
      },
      sass: {
         dev: {
            options: {
               style: 'expanded',
               compass: false
            },
            files: {
               'assets/css/style.css':'assets/css/sass/style.scss',
               'public/stylesheets/style.css':'assets/css/sass/style.scss'
            }
         },
         tissi: {
            options: {
               style: 'expanded',
               compass: false
            },
            files: {
               'public/stylesheets/tissi.css':'tissi/assets/sass/style.scss'
            }
         }
      },
      copy: {
         tissiPartials: {
            expand: true,
            flatten: true,
            src: ["tissi/app/**/*.html"],
            dest: "public/partials/tissi"
         },
         files: {
            expand: true,
            flatten: true,
            src: ["app/**/*.html"],
            dest: "public/partials/"
         },
         fonts: {
            expand: true,
            flatten: true,
            src: ["bower_components/components-font-awesome/fonts/*"],
            dest: "public/fonts/"
         },
         css: {
            expand: false,
            flatten: true,
            src: ["bower_components/leaflet/leaflet.css"],
            dest: "public/stylesheets/leaflet.css"
         }
      },

      concat: {
         libraries: {
            src: [
               "bower_components/jquery/dist/jquery.js",
               "bower_components/lodash/lodash.js",
               "bower_components/leaflet/leaflet-src.js",
               "bower_components/angular/angular.js",
               "bower_components/angular-ui-router/release/angular-ui-router.js",
               "bower_components/angular-animate/angular-animate.js",
               "bower_components/angular-messages/angular-messages.js",
               "bower_components/angular-bootstrap/ui-bootstrap.js",
               "bower_components/angular-bootstrap/ui-bootstrap-tpls.js"
            ],
            dest: "public/javascripts/libs.js"
         },
         tissiLibraries: {
            src: [
               "bower_components/jquery/dist/jquery.js",
               "bower_components/lodash/lodash.js",
               "bower_components/angular/angular.js",
               "bower_components/angular-ui-router/release/angular-ui-router.js",
               "bower_components/angular-animate/angular-animate.js",
               "bower_components/angular-messages/angular-messages.js",
               "bower_components/angular-touch/angular-touch.js",
               "bower_components/angular-bootstrap/ui-bootstrap.js",
               "bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
               "bower_components/angular-local-storage/dist/angular-local-storage.js",
               "bower_components/ladda-angular/dist/ladda-angular.js",
               "bower_components/angular-utf8-base64/angular-utf8-base64.js"
            ],
            dest: "public/javascripts/tissilibs.js"
         },
         leaflet: {
            src: [
               "bower_components/angular-simple-logger/dist/angular-simple-logger.js",
               "bower_components/ui-leaflet/dist/ui-leaflet.js",
            ],
            dest: "public/javascripts/ui-leaflet.js"
         }
      },
      cssmin: {
         options: {
            shorthandCompacting: false,
            roundingPrecision: -1
         },
         mycode: {
            files: {
               'public/stylesheets/tuho.min.css': [
                  "assets/css/style.css"
               ]
            }
         },
         tissi: {
            files: {
               'public/stylesheets/tissi.min.css': [
                  "public/stylesheets/tissi.css"
               ]
            }
         }
      },
      uglify: {
         my_min_files: {
            files: {
               'public/javascripts/tuho.min.js': [
                  "public/javascripts/tuho.js"

               ]
            }
         },
         tissi: {
            files: {
               'public/javascripts/tissi.min.js': [
                  "public/javascripts/tissi.js"

               ]
            }
         },
         leaflet: {
            files: {
               "public/javascripts/ui-leaflet.min.js" : [
                  "public/javascripts/ui-leaflet.js"
               ]
            }
         },
         libs: {
            files: {
               "public/javascripts/libs.min.js" : [
                  "public/javascripts/libs.js"
               ]
            }
         },
         tissilibs: {
            files: {
               "public/javascripts/tissilibs.min.js" : [
                  "public/javascripts/tissilibs.js"
               ]
            }
         }

      },
      //cache_control: {
      //   your_target: {
      //      source: ['wwwroot/index.html'],
      //      options: {
      //         version: "<%= hash %>",
      //         links: true,
      //         scripts: true,
      //         replace: true
      //      }
      //   }
      //},
      bower: {
         install: {
            options: {
               targetDir: "lib",
               layout: "byComponent",
               cleanTargetDir: false
            }
         }
      },
      watch: {
         appFolderTypeScripts: {
            files: ['app/**/*.ts'],
            tasks: ['ts']
         },
         tissiAppFolderTypeScripts: {
            files: ['tissi/app/**/*.ts'],
            tasks: ['ts']
         },
         appFolderCss: {
            files: ['content/**/*.css'],
            tasks: ['cssmin:mycode']
         },
         sass: {
            files: 'assets/css/sass/*.scss',
            tasks: ['sass:dev']
         },
         tissiSass: {
            files: 'tissi/assets/sass/*.scss',
            tasks: ['sass:tissi']
         },
         copy: {
            files: 'app/**/*.html',
            tasks: ['copy']
         },
         tissiCopy: {
            files: 'tissi/app/**/*.html',
            tasks: ['copy']
         }
      },
      typings: {
         install: {}
      }
      //tsd: {
      //   refresh: {
      //      options: {
      //         // execute a command
      //         command: 'reinstall',
      //
      //         //optional: always get from HEAD
      //         latest: true,
      //
      //         // specify config file
      //         config: 'tsd.json',
      //
      //         // experimental: options to pass to tsd.API
      //         opts: {
      //            // props from tsd.Options
      //         }
      //      }
      //   }
      //}


   });

   grunt.registerTask('development', ['concat', 'copy', 'ts', 'cssmin', 'watch']);
   grunt.registerTask('buildserver', ['concat', 'copy', 'typings', 'ts', 'uglify', 'cssmin']);
};