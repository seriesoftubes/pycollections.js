'use strict';

module.exports = function (grunt) {
  var BUILD_FILE = 'pycollections.js';
  var MINIFIED_FILE = 'pycollections.min.js';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
        js: [MINIFIED_FILE]
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        preserveComments: 'some',
        mangle: true,
        compress: true,
        sourceMap: false
      },
      target: {
        src: BUILD_FILE,
        dest: MINIFIED_FILE
      }
    },

    watch: {
      options: {
        livereload: true
      },
      files: [
        'Gruntfile.js',
        BUILD_FILE
      ],
      tasks: ['default']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['clean', 'uglify']);
  grunt.registerTask('livereload', ['default', 'watch']);
};
