/**
 * Meet.js CLI - 'init' command
 * Initialize Meet.js Environment with default files and settings
 */
'use strict';
(function (){
    var path = require('path');
    var fs = require('fs');

    var fse = require('fs-extra');
    var cpy = require('ncp').ncp;
    var inquirer = require('inquirer');
    var colors = require('cli-color');
    var async = require('async');
    var shell = require('shelljs');

    var hb = require('handlebars');
    var stringify = require('stringify-object');

    hb.registerHelper('json', function(context) {
        return JSON.stringify(context, undefined, 4);
    });
    hb.registerHelper('jsonso', function(context) {
        return stringify(context, { indent: '	', singleQuotes: true });
    });

    var Command = require('./../command');
    var Env = require('./../env');
    var Handler = require('./../handler');

    var initCommand = new Command('init');

    var settings = {};

    var APP_ROOT = Env.cwd;
    var MEET_ROOT = Env.root;

    /** Helpers **/
    function cleanFiles(pathToClean, done, hideIndicator){
        if (fs.existsSync(pathToClean)) {
            fs.readdir(pathToClean, function (err, files){

                var deleteFiles = function (next){
                    async.each(files, function (file, callback){
                        var toClean = path.resolve(pathToClean, file);
                        fse.remove(toClean, function (err){
                            callback();
                        });
                    }, function (err){
                        if (next) {
                            next();
                        }
                    });
                };

                if (hideIndicator) {
                    deleteFiles(done);
                    return;
                }

                var busyStopper = null;
                async.parallel([
                    function (cb){
                        busyStopper = cb;
                        //busy = showBusyIndicator('  Processing...');
                    },
                    function (cb){
                        deleteFiles(function (){
                            //hideBusyIndicator(busy);
                            busyStopper();
                            //console.log('Done clearing path: ' + pathToClean);
                            if (done && typeof done === 'function') {
                                done();
                            }
                            cb();
                        });
                    }
                ]);
            });
        } else {
            if (done && typeof done === 'function') {
                done();
            }
        }
    }

    function cleanAppFolder(done){
        var appPath = path.resolve(APP_ROOT, './');
        cleanFiles(appPath, done);
    }

    function cleanDistFolder(done){
        var distPath = path.resolve(MEET_ROOT, 'dist');
        cleanFiles(distPath, done, true);
    }

    function cleanUp(callback){
        cleanDistFolder(callback);
    }

    function getInitQuestions(){
        var questions = [];

        var q1 = {
            type: 'input', message: 'Application Name: ' + colors.black.bold('(*No spaces allowed)'), name: 'appTitle',
            default: 'MyApp'
        };
        questions.push(q1);

        var q2 = {
            type: 'input', message: 'Description: ', name: 'appDesc',
            default: 'A Meet.js Application'
        };
        questions.push(q2);

        var q3 = {
            type: 'input', message: 'Version: ', name: 'appVersion',
            default: '1.0.0'
        };
        questions.push(q3);

        var q4 = {
            type: 'input', message: 'Author Name: ', name: 'appAuthor',
            default: 'author'
        };
        questions.push(q4);

        return questions;
    }

    function copyScaffoldingFiles(dest, callback){
        var appSourcePath = path.resolve(Env.root, 'src/default-app');
        async.series([
            function (cb){
                cpy(appSourcePath, dest, function (err){
                    if (err) {
                        console.log(err);
                    }
                    cb();
                });
            }
        ], function (){
            callback();
        });
    }

    function buildTemplates(answers, callback){
        var filePath = path.resolve(MEET_ROOT, 'src/templates/package.hbs.json');
        var destDir = path.resolve(APP_ROOT);
        if (fs.existsSync(filePath)) {
            var template = fs.readFileSync(filePath, 'utf8');
            var templateFn = hb.compile(template);
            var destFilePath = path.resolve(destDir, 'package.json');

            var compiled = templateFn(answers);
            fse.ensureDirSync(destDir);
            fs.writeFileSync(destFilePath, compiled);
        } else {
            // error = true;
            console.log('File NOT exists! ' + filePath);
        }
        if (callback && typeof callback === 'function') {
            callback();
        }
    }

    function doneInitExit(success, code){
        var message = '  + Meet.js Initialization ';
        if (success) {
            message = message + colors.green('DONE') + '\n';
            message = message + '  Type "' + colors.yellow('meet install') + '" to proceed.';
        } else {
            message = message + colors.red('FAILED') + '\n';
            message = message + '  Please consult owner for further help. ' + code;
        }
        console.log(message);
    }

    function initMeet(initPath, done){
        console.log(colors.green('  Please answer the following questions to initialize your Meet.js application:'));

        var questions = getInitQuestions();
        
        inquirer.prompt(questions, function (answers){
            console.log('');
            async.series([
                function (callback){
                    copyScaffoldingFiles(initPath, callback);
                },
                function (callback){
                    //console.log('  - Building templates...');
                    var pkgData = {
                        name: answers.appTitle,
                        version: answers.appVersion,
                        description: answers.appDesc,
                        git: answers.appGitUrl,
                        author: answers.author
                    };
                    buildTemplates(pkgData, callback);
                },
                function (callback){
                    cleanUp(callback);
                }
            ], function (err, results){
                //Execute install if needed
                if (answers.install) {
                    shell.exec('npm install', function (code, output){
                        console.log('Exit code: ' + code);
                    });
                }
                if (err) {
                    doneInitExit(0, err);
                }
                doneInitExit(1);
                done();
            });
        });
    }

    function messagePrinter(code, silent){
        var messages = {};

        messages['C01'] = 'This will start initializing Meet.js in path: ' + colors.yellow(APP_ROOT) + '\n';
        messages['C01'] = messages['C01'] + '  Are you sure?';

        messages['C02'] = colors.cyan('This will overwrite current Meet.js environment with the default settings.\n');
        messages['C02'] = messages['C02'] + colors.red('  Overwriting Meet.js in path: ' + colors.magenta.bold(APP_ROOT) + '\n');
        messages['C02'] = messages['C02'] + '  All existing files in the above path will be ' + colors.red('DELETED.\n');
        messages['C02'] = messages['C02'] + '  Are you sure you want to proceed?';

        messages['C03'] = colors.cyan('Seems like the current folder is ') + colors.yellow('NOT EMPTY.\n');
        messages['C03'] = messages['C03'] + '  Everything in the path: ' + colors.magenta.bold(APP_ROOT) + ' will be ' + colors.red('OVERWRITTEN.\n');
        messages['C03'] = messages['C03'] + '  Are you sure you want to proceed anyway?';

        if (!silent) {
            console.log(messages[code]);
        }
        
        return messages[code];
    }

    function run (argv){
        if (Env.isSelf && (!argv.g && !argv.git)) {
            Handler.fail('You cannot init in a Meet.js repository!');
        }

        if (argv.g || argv.git) {
            //initialize git hooks only
            shell.exec('npm run postinstall');
            Handler.exit(0);
        }

        var confirmPrompt = messagePrinter((Env.json ? 'C02' : 'C01'), true);
        var proceedPrompt = messagePrinter('C03', true);
        var proceedInit = function (result){
            if (result.proceed !== 0) {
                var tasks = [];
                if (result.proceed === 2) {
                    tasks.push(function (callback){
                        cleanAppFolder(callback);
                    });
                }
                tasks.push(function (callback){
                    initMeet(APP_ROOT, callback);
                });

                //START INIT
                async.series(tasks, function (err){
                    //console.log('Done');
                });
            }
        };
        var confirmInit = function (result){
            if (result.confirm){
                var proceed = false;
                var appPath = path.resolve(APP_ROOT, './');
                if (fs.existsSync(appPath)) {
                    var files = fs.readdirSync(appPath);
                    if (files.length > 0) {
                        if (files.length === 1 && files[0] === '.git') {
                            //ignore git directory and proceed
                            proceedInit({ proceed: 1});
                        } else {
                            //detected non-empty directory
                            inquirer.prompt({
                                type   : 'list',
                                name   : 'proceed',
                                choices: [
                                    {name: ' {' + colors.yellow('Cancel') + '}             : I still want my stuff, Do NOTHING.', value: 0},
                                    {name: ' {' + colors.yellow('Proceed with KEEP') + '}  : Overwriting all the stuff without DELETING them.', value: 1},
                                    {name: ' {' + colors.yellow('Proceed with CLEAR') + '} : Delete everything and proceed with the process.', value: 2}
                                ],
                                message: proceedPrompt
                            }, proceedInit);
                        }
                    } else {
                        //EMPTY Folders, SAFE to go
                        proceedInit({ proceed: 1});
                    }
                }
            }
        };

        //START confirming Meet.js Initialization
        inquirer.prompt({ type: 'confirm', name: 'confirm',	message: confirmPrompt }, confirmInit);
    }


    /**
     * 'init' command Options
     */
    initCommand.desc = 'Initialize a new Meet.js project using current path.';
    initCommand.addOption({
        short: 'f',
        long: 'folder',
        desc: 'Create a new folder and perform initialization using that folder.'
    });

    initCommand.addExample({
        usage: 'meet init -f "My Project"',
        desc: 'This will perform initialization on a new folder named: "My Project" using current path.'
    });

    initCommand.run = function (argv) {
        run(argv);
    };

    module.exports = initCommand;
}());
