'use strict';
(function () {
    var colors = require('cli-color');

    var write = function (s) {
        process.stdout.write(s);
    };

    function MeetUtils() {}

    MeetUtils.prototype.log = function (msg, extraLine) {
        extraLine ? write('\n') : write('');

        write(colors.black.bold(' [Meet] '));
        write(msg + '\n\n');
        write('');
    };

    MeetUtils.prototype.printLogo = function () {
        write(" ##     ## ######## ######## ########           ##  ###### \n");
        write(" ###   ### ##       ##          ##              ## ##    ##\n");
        write(" #### #### ##       ##          ##              ## ##      \n");
        write(" ## ### ## ######   ######      ##              ##  ###### \n");
        write(" ##     ## ##       ##          ##        ##    ##       ##\n");
        write(" ##     ## ##       ##          ##    ### ##    ## ##    ##\n");
        write(" ##     ## ######## ########    ##    ###  ######   ###### \n");
        write('\n');
    };

    MeetUtils.prototype.write = function (s) {
        process.stdout.write(s);
    };

    var instance = new MeetUtils();
    instance.created = new Date();

    module.exports = instance;
}());