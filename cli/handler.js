/**
 * Meet.js CLI - Handler module
 *
 * Description:
 * A Meet.js CLI Handler that can be used for handling errors or exceptions
 */
'use strict';
(function (){
    var colors = require('cli-color');

    function Handler() {}
    
    Handler.prototype.fail = function (msg){
        if (msg) {
            process.stderr.write(colors.black.bold(' [Meet] '));
            process.stderr.write(colors.red.bold(msg));
        }
        process.stderr.write('\n');
        this.exit(1);
    };
    
    Handler.prototype.warn = function (msg){
        if (msg) {
            process.stderr.write(colors.black.bold(' [Meet] '));
            process.stderr.write(colors.yellow.bold(msg));
        }
        
        process.stderr.write('\n');
    };
    
    Handler.prototype.exit = function(code) {
        process.exit(code);
    };

    module.exports = new Handler();
}());
