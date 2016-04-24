/**
 * 'test' Task File:
 * Defines unit testing related tasks for gruntjs
 */
'use strict';
(function (){
    var path = require('path');
    var Env = require('./../cli/env');

    function initTasksDep (argv, grunt) {

        var tasksDep = ['karma:unit'];

        if (argv.tm || argv['time']) {
            require('time-grunt')(grunt);
        }

        return tasksDep;
    }

    function initConfig () {
        return {
            unit: {
                configFile: path.resolve(Env.cwd, './test/karma.conf.js')
            }
        }
    }

    module.exports = function (grunt) {
        grunt.config('karma', initConfig());
        grunt.loadNpmTasks('grunt-karma');

        var argv = grunt.option('argv');

        var tasksDep = initTasksDep(argv, grunt);

        grunt.registerTask('test', tasksDep);
    };
}());