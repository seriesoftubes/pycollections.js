'use strict';

module.exports = function (grunt) {
  var CONCAT_FILE = 'dist/pycollections.js';
  var MINIFIED_FILE = 'dist/pycollections.min.js';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
        js: [CONCAT_FILE, MINIFIED_FILE]
    },

    concat: {
      options: {
        separator: '\n'
      },
      dist: {
        src: [
          'src/header',

          'src/0.polyfills.js',
          'src/1.errors.js',
          'src/2.dict.js',
          'src/3.defaultdict.js',
          'src/4.counter.js',
          'src/5.ordereddict.js',
          'src/6.namedtuple.js',

          'src/footer'
        ],
        dest: CONCAT_FILE
      }
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
        src: CONCAT_FILE,
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
      files: ['src/*.js', 'test/*.js'],
      tasks: ['default']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['jasmine_node', 'karma']);
  grunt.registerTask('default', ['clean', 'concat', 'uglify', 'test']);
  grunt.registerTask('livereload', ['default', 'watch']);
};
