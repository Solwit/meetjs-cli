module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      "jasmine", "requirejs"
    ],

    // list of files / patterns to load in the browser
    files: [
      'test/main-test.js',

      { pattern: 'app/bower_components/**/*.js', included: false },
      { pattern: 'app/scripts/**/*.js', included: false },
      { pattern: 'test/spec/**/*.js', included: false }
    ],

    // list of files / patterns to exclude
    exclude: [
      'app/scripts/main.js'
    ],

    // web server port
    port: 9876,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      "PhantomJS"
    ],

    // Which plugins to enable
    plugins: [
      "karma-phantomjs-launcher",
      "karma-chrome-launcher",
      "karma-jasmine",
      "karma-requirejs",
      "karma-html-reporter",
      "karma-coverage",
      "karma-mocha-reporter",
      "karma-junit-reporter"
    ],

    singleRun: true,
    colors: true,

    // possible log values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    preprocessors: {
      'app/scripts/controllers/**/*.js': ['coverage']
    },

    reporters: ['html', 'coverage', 'mocha', 'junit'],

    coverageReporter: {
      dir: 'reports/coverage',
      reporters: [
        {type: 'html'}
      ],
      includeAllSources: true
    },

    mochaReporter: {
      output: 'noFailures'
    },

    htmlReporter: {
      outputDir: 'reports/unit'
    },

    junitReporter: {
      outputDir: 'reports/unit',
      outputFile: 'unit-tests.xml',
      userBrowserName: false
    }
  });
};
