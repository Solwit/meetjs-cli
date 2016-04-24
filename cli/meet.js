'use strict';
(function () {
    var colors = require('cli-color');
    var argv = require('minimist')(process.argv.slice(2));
    var _ = require('underscore');

    var fs = require('fs');
    var path = require('path');

    var MeetEnv = require('./env');
    var COMMANDS_PATH = './cli/commands/';
    var LOCAL_COMMANDS_PATH = './commands/';

    var utils = require('./utils');

    var loadCommands = function (){
        var allCommands = {};

        try {
            var globalCommandFiles = fs.readdirSync(path.resolve(MeetEnv.root, COMMANDS_PATH)),
                i, j, commandFile, commandName;

            for (i = 0, j = globalCommandFiles.length; i < j; i++){
                commandFile = globalCommandFiles[i];
                commandName = (commandFile.substring(0, commandFile.length - 3));
                //strip off .js file extension

                allCommands[commandName] = {
                    path: path.resolve(MeetEnv.root, COMMANDS_PATH, commandFile),
                    global: true
                };
            }
        } catch (err) {}

        try {
            var localCommandFiles = fs.readdirSync(path.resolve(MeetEnv.cwd, LOCAL_COMMANDS_PATH));

            for (i = 0, j = localCommandFiles.length; i < j; i++){
                commandFile = localCommandFiles[i];
                commandName = (commandFile.substring(0, commandFile.length - 3));
                //strip off .js file extension

                allCommands[commandName] = {
                    path: path.resolve(MeetEnv.cwd, LOCAL_COMMANDS_PATH, commandFile),
                    global: false
                };
            }
        } catch (err) {}

        return allCommands;
    };
    
    function Meet() {
        this.commands = loadCommands();
    }

    Meet.prototype.run = function () {
        var command = argv._[0];

        if (!command){
            this.help();

            return;
        }

        if (_.has(this.commands, command)){
            var loadedCommand = require(this.commands[command].path);
            
            this.commands[command].command = loadedCommand;

            if (!loadedCommand.conf.silent) {
                utils.log('Executing command: ' + colors.cyan(command), true);
            }

            return loadedCommand.execute(argv);
        }

        if (command !== 'help') {
            utils.log(colors.red('Oops, command: "') + colors.red.bold(command) + colors.red('" is invalid.'), true);
        }

        return this.help();
    };
    
    Meet.prototype.help = function () {
        var self = this;

        utils.write('\n');

        utils.printLogo();

        utils.write(' Available commands: (use --help or -h for more info)');
        utils.write('\n');

        var cmdListMsg = '\n';
        _.forEach(_.keys(self.commands), function (cmd){
            if(self.commands[cmd].global) {
                cmdListMsg = cmdListMsg + '  ' + colors.yellow(cmd) + '\n';
            }
        });
        
        console.log(cmdListMsg);

        utils.write(' Available local commands (specific for current Meet.js application): (use --help or -h for more info)');
        utils.write('\n');

        cmdListMsg = '\n';

        _.forEach(_.keys(self.commands), function (cmd){
            if(!self.commands[cmd].global) {
                cmdListMsg = cmdListMsg + '  ' + colors.yellow(cmd) + '\n';
            }
        });

        console.log(cmdListMsg);
    };

    process.on('uncaughtException', function(err) {
        console.log('');
        console.log(err.toString());
    });
    
    var instance = new Meet();
    instance.created = new Date();
    
    module.exports = instance;
    global.meet = instance;
}());