'use strict';

module.exports = function (grunt) {
  var CONCAT_FILE = 'build/collections.js';
  var DIST_FILE = 'dist/collections.min.js';
  var UNCONCATENATED_SOURCE_FOLDER = 'src/';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
        js: [CONCAT_FILE, DIST_FILE]
    },

    concat: {
      options: {
        separator: ''
      },
      library: {
        src: [
          // order matters!
          UNCONCATENATED_SOURCE_FOLDER + 'dict.js',
          UNCONCATENATED_SOURCE_FOLDER + 'defaultdict.js',
          UNCONCATENATED_SOURCE_FOLDER + 'counter.js',
        ],
        dest: CONCAT_FILE
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */',
        preserveComments: 'some',
        mangle: true,
        compress: true,
        sourceMap: true
      },
      target: {
        src: CONCAT_FILE,
        dest: DIST_FILE
      }
    },

    watch: {
      options: {
        livereload: true
      },
      files: [
        'Gruntfile.js',
        UNCONCATENATED_SOURCE_FOLDER + '*.js'
      ],
      tasks: ['default']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['clean', 'concat', 'uglify']);
  grunt.registerTask('livereload', ['default', 'watch']);
};
