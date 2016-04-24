#!/usr/bin/env node
/**
 * meet.js CLI npm module
 *
 *  .----------------.  .----------------.  .----------------.  .----------------.  .----------------.  .----------------.  .----------------.
 * | .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. |
 * | | ____    ____ | || |  _________   | || |  _________   | || |  _________   | || |              | || |     _____    | || |    _______   | |
 * | ||_   \  /   _|| || | |_   ___  |  | || | |_   ___  |  | || | |  _   _  |  | || |              | || |    |_   _|   | || |   /  ___  |  | |
 * | |  |   \/   |  | || |   | |_  \_|  | || |   | |_  \_|  | || | |_/ | | \_|  | || |              | || |      | |     | || |  |  (__ \_|  | |
 * | |  | |\  /| |  | || |   |  _|  _   | || |   |  _|  _   | || |     | |      | || |              | || |   _  | |     | || |   '.___`-.   | |
 * | | _| |_\/_| |_ | || |  _| |___/ |  | || |  _| |___/ |  | || |    _| |_     | || |      _       | || |  | |_' |     | || |  |`\____) |  | |
 * | ||_____||_____|| || | |_________|  | || | |_________|  | || |   |_____|    | || |     (_)      | || |  `.___.'     | || |  |_______.'  | |
 * | |              | || |              | || |              | || |              | || |              | || |              | || |              | |
 * | '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' |
 * '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------'
 *
 */
(function () {
    process.title = "meet";

    var Meet = require('../cli/meet');

    Meet.run();
}());