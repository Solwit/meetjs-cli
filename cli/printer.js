/**
 * Meet.js CLI - Command Help Printer
 *
 * Description:
 * A Meet.js CLI Command Help Printer that can be used for printing Help messages
 */
'use strict';
(function (){

    /** Dependencies Import **/
    var colors = require('cli-color');
    var utils = require('./utils');

    /** CONSTANT **/
    var LINE_START_SPACING = 3;
    var DELIMITER_START_SPACING = 2;
    var DELIMITER_END_SPACING = 2;

    var MIN_DELIMITER_LENGTH = 2;
    var NAME_LENGTH = LINE_START_SPACING + 15 + DELIMITER_START_SPACING;
    var NAME_ARGS_LENGTH = LINE_START_SPACING + 30 + DELIMITER_START_SPACING;


    function HelpPrinter() {}

    HelpPrinter.prototype.print = function (commands){
        if (!commands) {
            throw new Error('No valid command found for printing help messages.');
        }

        if (!commands.length) {
            this.printUsage(commands);
        }
    };

    HelpPrinter.prototype.printCommand = function (command){
        printCommand(command, command.hasArgs());
    };

    HelpPrinter.prototype.printUsage = function (command){
        printUsage(command);
    };

    var rw = function (char, length){
        var counter = 0;
        var msg = '';
        while (length > counter) {
            msg = msg + char;
            counter++;
        }
        return msg;
    };

    var noop = function (str){ return str; };

    var formatDesc = function (desc, padding, colorFn){
        padding = padding ? padding : 0;
        colorFn = colorFn ? colorFn : noop;
        var result = '';

        if (desc.indexOf('\n') > 0){
            var splittedByNewLines = desc.split('\n');
            for(var x = 0; x < splittedByNewLines.length; x++) {
                if(x === 0) {
                    result = colorFn(splittedByNewLines[x]);
                } else {
                    result = result + '\n' + rw(' ', padding) + colorFn(splittedByNewLines[x]);
                }
            }
        } else {
            return colorFn(desc);
        }

        return result;
    };

    var getDelimiterLength = function (command, sectionLength, withArgs){
        if(!withArgs){
            return sectionLength - LINE_START_SPACING - DELIMITER_START_SPACING - command.name.length;
        }

        var counter = 0;
        var length = 0;
        for (var arg in command.args){
            if (command.args.hasOwnProperty(arg)){
                length = length + arg.length;
                counter++;
            }
        }
        return sectionLength - LINE_START_SPACING - DELIMITER_START_SPACING - (command.name.length + length + counter);
    };

    var getOptionsSectionLength = function (command){

        if(command.options.length === 0){
            return 0;
        }

        var longestOption = null;
        var longestOptionLength = 0;

        for (var i = 0, j = command.options.length; i < j; i++){
            var currentOption = command.options[i];
            if (currentOption && currentOption.long && currentOption.long.length > longestOptionLength){
                longestOption = currentOption;
                longestOptionLength = currentOption.long.length;
            }
        }

        return longestOptionLength + 5;
    };

    var getCommandNameText = function (command, withArgs, colorFn, colorFn2){
        colorFn = colorFn ? colorFn : noop;
        colorFn2 = colorFn2 ? colorFn2 : colorFn;

        var resultText = colorFn(command.name);
        if (!withArgs){
            return resultText;
        }

        for (var arg in command.args){
            if (command.args.hasOwnProperty(arg)){
                resultText = resultText + ' ' + colorFn2(arg);
            }
        }

        return resultText.trim();
    };

    var getCommandDescWithArgs = function (command, padding, colorFn){
        padding = padding ? padding : 1;
        colorFn = colorFn ? colorFn : noop;

        var resultMsg = rw(' ', padding);
        resultMsg = resultMsg + formatDesc(command.desc, padding);

        resultMsg = resultMsg + '\n';

        for (var arg in command.args){
            if (command.args.hasOwnProperty(arg)){
                resultMsg = resultMsg + rw(' ', padding) + colorFn(arg) + ' ' + formatDesc(command.args[arg], padding + arg.length + 1) + '\n';
            }
        }

        return resultMsg;
    };

    function printExamples (command, padding){
        padding = padding ? padding : LINE_START_SPACING;
        if (command.examples.length === 0){
            return;
        }
        //Print: Example:
        var outputMsg = ' Examples: \n';

        for (var i = 0, j = command.examples.length; i < j; i++){
            var currentExample = command.examples[i];
            var currentMsg = '';

            currentMsg = currentMsg + rw(' ', padding);
            currentMsg = currentMsg + colors.black.bold(currentExample.usage) + '\n';
            currentMsg = currentMsg + rw(' ', padding);
            currentMsg = currentMsg + ' - ' + currentExample.desc + '\n';

            outputMsg = outputMsg + currentMsg;
        }

        outputMsg = outputMsg + '\n';
        utils.write(outputMsg);
    }

    function printOptions (command, padding){
        padding = padding ? padding : LINE_START_SPACING;
        if (command.options.length === 0){
            return;
        }

        var delimiterSectionLength = getOptionsSectionLength(command);
        var outputMsg = '';
        var optionMessages = [];
        var totalNewLinePadding = padding + DELIMITER_START_SPACING + delimiterSectionLength + DELIMITER_END_SPACING + 8;

        for (var i = 0, j = command.options.length; i < j; i++){
            var currentOption = command.options[i];
            var currentMsg = '';
            currentMsg = currentMsg + rw(' ', padding);

            if (currentOption.short) {
                currentMsg = currentMsg + colors.bold.yellow(' -' + currentOption.short);
                currentMsg = currentMsg	+ ' | ';
            }

            currentMsg = currentMsg	+ colors.bold.yellow('--' + currentOption.long);
            currentMsg = currentMsg + rw(' ', DELIMITER_START_SPACING);
            currentMsg = currentMsg + rw('.', delimiterSectionLength - currentOption.long.length);
            currentMsg = currentMsg + rw(' ', DELIMITER_END_SPACING);
            currentMsg = currentMsg + colors.bold(formatDesc(currentOption.desc, totalNewLinePadding)) + '\n';
            optionMessages.push(currentMsg);
            outputMsg = outputMsg + currentMsg;
        }

        var optionalOrRequire = command.conf.enforceOptions ? 'At least ONE option must be specified.' : 'All options are optional.';

        outputMsg = outputMsg + '\n';
        outputMsg = outputMsg + rw(' ', padding) + optionalOrRequire + '\n';
        utils.write(outputMsg);
    }

    function printUsage (command){
        var usagePadding = 3;
        //Print: Usage: meet <command> <Args> [options]
        var usageMsg = ' Usage: ' + colors.bold('meet ');

        //Print out the command name
        usageMsg = usageMsg + getCommandNameText(command, command.hasArgs(), colors.green.bold, colors.black.bold) + ' ';

        //Print out [options] if available
        if (command.hasOptions()) {
            usageMsg = usageMsg + colors.bold.yellow('[options]') + '\n';
        }
        usageMsg = usageMsg + '\n';
        usageMsg = usageMsg + getCommandDescWithArgs(command, usagePadding, colors.black.bold);
        usageMsg = usageMsg + '\n';

        utils.write(usageMsg);
        printOptions(command, usagePadding);
        utils.write('\n');
        printExamples(command);
    }

    function printCommand (command, withArgs){
        var delimiterSectionLength = withArgs ? NAME_ARGS_LENGTH : NAME_LENGTH;
        var delimiterLength = getDelimiterLength(command, delimiterSectionLength, withArgs);

        var outputMsg = '';
        if (delimiterLength < MIN_DELIMITER_LENGTH){
            throw new Error('Command name is too long, exceeding the delimiter\'s limit!');
        }

        //Print out the Pre-Padding spaces
        outputMsg = outputMsg + rw(' ', LINE_START_SPACING);

        //Print out the Command Name (with/without Args)
        outputMsg = outputMsg + getCommandNameText(command, withArgs, colors.green.bold, colors.black.bold) + rw(' ', DELIMITER_START_SPACING);

        //Print out dotted lines
        var dottedLine = rw('.', delimiterLength);
        outputMsg = outputMsg + dottedLine + rw(' ', DELIMITER_END_SPACING);

        outputMsg = outputMsg + formatDesc(command.desc, delimiterSectionLength + DELIMITER_END_SPACING, colors.bold) + '\n';

        utils.write(outputMsg);
    }

    module.exports = new HelpPrinter();
}());
