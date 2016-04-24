/**
 * 'serve' Task File:
 * Defines unit testing related tasks for gruntjs
 */
'use strict';
(function (){
    var path = require('path');
    var Env = require('./../cli/env');
    var utils = require('./../cli/utils');

    var appConfig = {
        app: require(path.resolve(Env.cwd, './bower.json')).appPath || 'app'
    };

    function initTasksDep (argv, grunt) {
        if (argv.tm || argv['time']) {
            require('time-grunt')(grunt);
        }
    }

    module.exports = function (grunt) {
        grunt.initConfig({});

        var argv = grunt.option('argv');

        initTasksDep(argv, grunt);

        var connect = require('connect');
        var serveStatic = require('serve-static');

        grunt.registerTask('serve', 'Start a static web server', function () {
            this.async();

            connect(serveStatic(appConfig.app)).listen(9000);

            utils.write('HTTP server running on localhost...\n');
            utils.write('Open your web browser and enter http://localhost:9000 to start browsing your application...\n');
        });
    };
}());