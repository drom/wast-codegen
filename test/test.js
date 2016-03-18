'use strict';

var fs = require('fs'),
    path = require('path'),
    // expect = require('chai').expect,
    jsof = require('jsof'),
    codegen = require('../');

var src = path.resolve(__dirname, '../wast-parser/results/');

var astFileNames = fs.readdirSync(src);

describe('codegen', function () {
    astFileNames.forEach(function (name) {
        it(name, function (done) {
            if (name.match('^(.*)js$')) {
                fs.readFile(
                    path.resolve(src, name),
                    'utf8',
                    function (err, jsData) {
                        var ast;
                        if (err) { throw err; }
                        ast = jsof.p(jsData);
                        var res = codegen.generate(ast);
                        // console.log(res);
                        done();
                    }
                );
            } else {
                done();
            }
        });
    });
});
