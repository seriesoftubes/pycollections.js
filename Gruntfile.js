'use strict';

module.exports = function (grunt) {
  var BUILD_FILE = 'pycollections.js';
  var MINIFIED_FILE = 'dist/pycollections.min.js';

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

    jasmine_node: {
      options: {
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'spec'
      },
      all: []
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
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
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['jasmine_node', 'karma']);
  grunt.registerTask('default', ['clean', 'uglify', 'test']);
  grunt.registerTask('livereload', ['default', 'watch']);
};
