'use strict';

module.exports = function(config) {
  config.set({
    // used to resolve files + excludes
    basePath: '',

    frameworks: ['jasmine'],

    // to load in the browser
    files: [
      'pycollections.min.js',
      'test/dict.spec.js',
      'test/defaultdict.spec.js',
      'test/counter.spec.js',
    ],

    exclude: [
      'pycollections.js',
      'Gruntfile.js',
      'SpecRunner.html',
      'README.md',
      'package.json',
      'LICENSE',
      'karma.conf.js',
    ],

    reporters: ['progress'],

    // karma server port
    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    // rerun tests whenever any file changes
    autoWatch: false,

    browsers: [
      'Chrome',
      'Firefox',
      'Safari'
    ],

    // kill browser if it doesn't capture by this deadline (ms)
    captureTimeout: 30000,

    // if true, run tests in browser then exit
    singleRun: true
  });
};
