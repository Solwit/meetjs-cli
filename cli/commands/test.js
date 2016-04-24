/**
 * Meet.js CLI - 'test' command
 * Executes unit tests on current codes using Karma Test Runner.
 */
'use strict';
(function (){
    var fs = require('fs');
    var path = require('path');
    var utils = require('./../utils');

    var Command = require('./../command');
    var Env = require('./../env');
    var Handler = require('./../handler');

    var testCommand = new Command('test');

    var TEST_CONFIG_PATH = path.resolve(Env.root, './grunts/' + testCommand.name + '.js');

    function run (argv){
        if (!Env.isMeetProject){
            Handler.fail('Error! Not a valid Meet.js Project path.');
        }

        if (fs.existsSync(TEST_CONFIG_PATH)){
            testCommand.loadTask(TEST_CONFIG_PATH, argv);

            var tasks = [testCommand.name];
            testCommand.startGruntTasks(tasks);
        } else {
            Handler.fail('Error loading task file. Please make sure the file exists.');
        }
    }

    /**
     * 'install' command Options
     */
    testCommand.desc = 'Execute Unit Tests and calculate code coverage for quality indicators.\nReports are generated by default on every run.';

    testCommand.addOption({
        long: 'time',
        desc: 'Runs grunt time extension to measure command execution time.'
    });

    testCommand.addExample({
        usage: 'meet test',
        desc: 'This will perform unit tests on all files.'
    });

    testCommand.addExample({
        usage: 'meet test --time',
        desc: 'This will perform unit tests on all files with time report of their execution.'
    });

    testCommand.run = function (argv) {
        run(argv);
    };

    module.exports = testCommand;
}());
