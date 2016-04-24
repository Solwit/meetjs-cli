/**
 * Meet.js CLI - 'install' command
 * Installs all Meet.js application dependencies (both npm and Bower)
 */
'use strict';
(function (){
    var shell = require('shelljs');
    var utils = require('./../utils');

    var Command = require('./../command');
    var Env = require('./../env');
    var Handler = require('./../handler');

    var installCommand = new Command('install');

    function run (){
        if (!Env.isMeetProject){
            Handler.fail('Error! Not a valid Meet.js Project path.');
        }

        shell.exec('npm install', function (code) {
            if (code !== 0) {
                utils.log("Error during execution of 'npm install' command...", true);
                return;
            }

            shell.exec('bower install', function (code){
                if (code !== 0) {
                    utils.log("Error during execution of 'bower install' command...", true);
                }
            });
        });
    }


    /**
     * 'install' command Options
     */
    installCommand.desc = 'Installs all Meet.js application dependencies (both npm and Bower).';

    installCommand.addExample({
        usage: 'meet install',
        desc: 'This will perform installation of all npm and Bower dependencies in current project directory.'
    });

    installCommand.run = function (argv) {
        run(argv);
    };

    module.exports = installCommand;
}());
