var http = require('http');
var IncomingMessage = http.IncomingMessage;
var STATUS_CODES = http.STATUS_CODES;

var version = /v(\d)\.(\d+)\.(\d+)/.exec(process.version);
var major = parseInt(version[1], 10);
var minor = parseInt(version[2], 10);
var release = parseInt(version[3], 10);

// http.IncomingMessage.statusMessage was introduced in node v0.11.10
if (major === 0 && (minor < 11 || (minor === 11 && release < 10)) &&
        !IncomingMessage.prototype.hasOwnProperty('statusMessage')) {
    Object.defineProperty(IncomingMessage.prototype, 'statusMessage', {
        get: function () {
            return STATUS_CODES[this.statusCode];
        }
    });
}
