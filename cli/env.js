/**
 * Meet.js CLI - Env module
 *
 * Description:
 * Retrieve and provide information about current Meet.js execution environment
 */
'use strict';
(function (){
    var path = require('path');

    var CLI_ROOT = path.resolve(__dirname, './../');
    var MEET_JSON_FILENAME = 'meet.json';

    var cwd = process.cwd();

    var checkCwdMeetJsonFile = function (){
        var result = {
            json: null,
            isSelf: false
        };
        
        try {
            var meetJson = require(path.resolve(cwd, MEET_JSON_FILENAME));
            
            if (meetJson) {
                result.json = meetJson;
                result.isSelf = meetJson.self;
            }
        } catch (ex) {}
        
        return result;
    };

    function MeetEnv() {
        this.root = CLI_ROOT;
        this.cwd = cwd;

        Object.defineProperty(this, 'isMeetProject', {
            get: function (){
                return this.json !== null;
            }
        });

        this.scan();
    }

    MeetEnv.prototype.scan = function (){
        var result = checkCwdMeetJsonFile();
        
        this.json = result.json;
        this.isSelf = result.isSelf;
    };

    module.exports = new MeetEnv();
}());
