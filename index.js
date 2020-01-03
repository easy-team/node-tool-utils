'use strict';
exports.chalk = require('chalk');
exports.shell = require('shelljs');
exports.glob = require('glob');
exports.httpserver = require('node-http-server');
exports.killer = require('cross-port-killer');
exports.opn = require('opn');
Object.assign(exports, require('./lib/tool'));
