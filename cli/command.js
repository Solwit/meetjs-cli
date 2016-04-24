/**
 * Meet.js CLI - Command
 *
 * Description:
 * A Meet.js Command that can be used for executing specific task
 */
'use strict';
(function (){
    var util = require('util');
    var path = require('path');
    var _ = require('underscore');

    var utils = require('./utils');

    var grunt = require('grunt');

    var printer = require('./printer');
    var errorHandler = require('./handler');
    var env = require('./env');

    function Command(name) {
        if (!name){
            throw new Error('A Command must specify a valid name.');
        }

        var self = this;

        this.name = name;
        this.desc = '';
        this.args = {};
        this.conf = {
            haltOnError: false,
            exitOnExecute: false,
            enforceOptions: false,
            silent: false
        };

        this.options = [{
            short: 'h',
            long: 'help',
            desc: 'Display Help information about current command.',
            fn: function (){
                self.help();
            }
        }];
        this.examples = [];

        this.printer = printer;
        this.env = env;
        this.grunt = grunt;
        this.grunt.log.header = function() {};
    }

    Command.prototype.loadTask = function (taskFilePath, argv) {
        this.grunt.option('argv', argv);
        
        require(taskFilePath)(this.grunt);
    };

    Command.prototype.startGruntTasks = function (tasks) {
        this.grunt.cli.tasks = tasks;
        
        this.grunt.cli({
            gruntfile: path.resolve(env.cwd, 'gruntfile.js'),
            base: env.cwd,
            argv: this.grunt.option('argv')
        });
    };

    Command.prototype.execute = function (argv) {
        try {
            var matchedOptions = this.matchOptions(argv);

            for (var i = 0, j = matchedOptions.length; i < j; i++) {
                if (matchedOptions[i].fn) {
                    matchedOptions[i].fn(argv);

                    if (matchedOptions[i].short === 'h'){
                        return;
                    }
                }
            }

            if (matchedOptions.length === 0 && this.conf.enforceOptions){
                return this.help();
            }

            if (_.isFunction(this.run)) {
                this.run(argv);
            }

            if (this.conf.exitOnExecute){
                errorHandler.exit(0);
            }
        } catch (err){
            if (this.conf.haltOnError) {
                utils.log(err, true);
                this.fail('Error occured during execution of command: ' + this.name);
            }

            utils.log(err, true);
        }
    };
    
    Command.prototype.config = function (conf){
        var self = this;
        
        for (var property in conf) {
            if (conf.hasOwnProperty(property)) {
                self.conf[property] = conf[property];
            }
        }
    };

    Command.prototype.matchOptions = function (argv){
        var results = [];
        var errors = [];
        var self = this;

        var findOption = function (arg){
            if (self.options.length > 0){
                for (var i = 0, j = self.options.length; i < j; i++){
                    if (arg === self.options[i].short || arg === self.options[i].long){
                        return self.options[i];
                    }
                }
            }
            return null;
        };

        if (argv){
            var keys = Object.keys(argv);
            for (var m = 0, n = keys.length; m < n; m++){
                if (keys[m] === '_'){
                    continue;
                }
                var found = findOption(keys[m]);
                if (found){
                    if (found.short === 'h'){
                        //Returning only the Help option
                        return [found];
                    }

                    results.push(found);
                } else {
                    errors.push(' Invalid option: "' + keys[m] + '"');
                }
            }
        }
        return results;
    };
    
    Command.prototype.addOption = function (option){
        if (!option){
            throw new Error('A valid option must be specified for a command.');
        }
        
        this.options.push(option);

        this.options.sort(function (optA, optB){
            if (!optA.short || optA.short === 'h') {
                return -9999;
            }

            if (!optB.short || optB.short === 'h') {
                return 9999;
            }
            
            return optA.short.charCodeAt(0) - optB.short.charCodeAt(0);
        });
    };
    
    Command.prototype.addArg = function (arg, desc){
        this.args[arg] = desc;
    };
    
    Command.prototype.addExample = function (example){
        if (!example){
            throw new Error('A valid example must be specified for a command.');
        }
        
        this.examples.push(example);
    };
    
    Command.prototype.setPrinter = function (printer){
        if (!_.isFunction(printer)) {
            throw new Error('Printer is not compatible with the interface: "print" function not found.');
        }

        this.printer = printer;
    };

    Command.prototype.hasArgs = function () {
        return _.keys(this.args).length > 0;
    };
    
    Command.prototype.hasOptions = function (){
        return this.options.length > 0;
    };
    
    Command.prototype.hasExamples = function (){
        return this.examples.length > 0;
    };

    Command.prototype.fail = function (msg){
        errorHandler.fail(msg);
    };

    Command.prototype.help = function (){
        utils.printLogo();
        this.printer.print(this);
    };

    module.exports = Command;
}());
