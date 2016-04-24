/**
 * Meet.js CLI - 'serve' command
 * Runs the HTTP serve serving application files
 */
'use strict';
(function (){
    var fs = require('fs');
    var path = require('path');
    var utils = require('./../utils');

    var Command = require('./../command');
    var Env = require('./../env');
    var Handler = require('./../handler');

    var serveCommand = new Command('serve');

    var PATH = path.resolve(Env.root, './grunts/' + serveCommand.name + '.js');

    function run (argv){
        if (!Env.isMeetProject){
            Handler.fail('Error! Not a valid Meet.js Project path.');
        }

        if (fs.existsSync(PATH)){
            serveCommand.loadTask(PATH, argv);

            var tasks = [serveCommand.name];
            serveCommand.startGruntTasks(tasks);
        } else {
            Handler.fail('Error loading task file. Please make sure the file exists.');
        }
    }

    /**
     * 'serve' command Options
     */
    serveCommand.desc = 'Runs the HTTP serve serving Meet.js application files.';

    serveCommand.addExample({
        usage: 'meet serve',
        desc: 'This will run the HTTP server and open system default web browser with index.html file'
    });

    serveCommand.run = function (argv) {
        run(argv);
    };

    module.exports = serveCommand;
}());
