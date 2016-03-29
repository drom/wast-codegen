'use strict';

var lib = require('../');
var parser = require('wast-parser');
var expect = require('chai').expect;

describe('basic', function () {
    it('t0', function (done) {
        var generated = lib.generate({
            kind: 'binop',
            type: 'i32',
            operator: 'add',
            left: {
                kind: 'get_local',
                id: {
                    kind: 'identifier',
                    name: 'x'
                }
            },
            right: {
                kind: 'get_local',
                id: {
                    kind: 'identifier',
                    name: 'y'
                }
            }
        }, 2);

        var expected =
`(i32.add
  (get_local $x)
  (get_local $y))`;

        expect(generated).to.eq(expected)
        done();
    });

    it('module', function (done) {
        var wast = '(module)';
        var json = parser.parse(wast);
        var result = lib.generate(json);
        // console.log(result);
        expect(result).to.eq(wast);
        done();
    });

    it('param', function (done) {
        var wast = `(module(func(param i32))(func(param i32)))`;
        var json = parser.parse(wast);
        var result = lib.generate(json);
        expect(result).to.eq(wast);

        wast =
`(module
  (func
    (param i32))
  (func
    (param i32)))`;

        var json = parser.parse(wast);
        var result = lib.generate(json, 2);
        expect(result).to.eq(wast);
        done();
    });
});
