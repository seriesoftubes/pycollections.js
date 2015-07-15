'use strict';

module.exports = function (grunt) {
  var CONCAT_FILE = 'build/collections.js';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ''
      },
      library: {
        src: [
          // order matters!
          'src/dict.js',
          'src/defaultdict.js',
          'src/counter.js',
        ],
        dest: CONCAT_FILE
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        mangle: false,
        compress: true,
        sourceMap: true
      },
      target: {
        src: CONCAT_FILE,
        dest: 'dist/collections.min.js'
      }
    },

    watch: {
      options: {
        livereload: true
      },
      files: [
        'Gruntfile.js',
        'src/*.js'
      ],
      tasks: ['default']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['concat', 'uglify']);
  grunt.registerTask('livereload', ['default', 'watch']);
};
