var assert = require('assert');
var http = require('http');
var IncomingMessage = http.IncomingMessage;
var STATUS_CODES = http.STATUS_CODES;
require('../index');

describe('polyfill', function () {
    var version = /v(\d)\.(\d+)\.(\d+)/.exec(process.version);
    var major = parseInt(version[1], 10);
    var minor = parseInt(version[2], 10);
    var release = parseInt(version[3], 10);

    if (major > 0 || minor > 11 || (minor === 11 && release >= 10)) {
        it('should not polyfill because ' + process.version + ' >= v0.11.10', function () {
            assert(!IncomingMessage.prototype.hasOwnProperty('statusMessage'));
        });
    } else {
        it('should polyfill because ' + process.version + ' < v0.11.10', function () {
            assert(IncomingMessage.prototype.hasOwnProperty('statusMessage'));
        });

        it('should not polyfill if already polyfilled', function () {
            for (var key in require.cache) {
                delete require.cache[key];
            }
            require('../index');
            for (var key in require.cache) {
                delete require.cache[key];
            }
            require('../index');
        });
    }

    var server = http.createServer(function (req, res) {
        for (var code in STATUS_CODES) {
            if (req.url === '/' + code) {
                res.writeHead(code);
                res.end('blah');
                return;
            }
        }
    });
    server.listen(3737);

    Object.keys(STATUS_CODES).sort().forEach(function (code) {
        if (String(code) === '100') return;

        it('should return the correct status message for ' + code, function (done) {
            http.get('http://localhost:3737/' + code, function (res) {
                assert.equal(res.statusMessage, STATUS_CODES[code]);
                res.destroy();
                done();
            });
        });
    });
});
