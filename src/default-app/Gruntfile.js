/**
 * Grunt Task Runner configuration file
 * contains all the tasks configured to enable automated development workflow
 */
'use strict';
(function (){
    var grunt = require('grunt');

    module.exports = function (grunt) {
        grunt.registerTask('default', 'Default Task', function () {
            grunt.log.writeln('');
            grunt.log.writeln('== Welcome to Meet.js ==');
            grunt.log.writeln('Please use \'meet serve\' to start your development. ');
            grunt.log.writeln('');
        });
    };
}());
