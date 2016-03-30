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

    it('literal', function (done) {
        var wast = `(module(func 0(param i32))(func(param i32)))`;
        var json = parser.parse(wast);
        var result = lib.generate(json);
        expect(result).to.eq(wast);

        wast = `(module(import "test" "test"))`;
        json = parser.parse(wast);
        result = lib.generate(json);
        expect(result).to.eq(wast);
        done();
    });

    it('result', function (done) {
        var wast = `(module(func 0(result i32)(i32.const 1)))`;
        var json = parser.parse(wast);
        var result = lib.generate(json);
        expect(result).to.eq(wast);
        done();
    });

    it('relop', function (done) {
        var wast = '(module(func(i32.eq(i32.const 1)(i32.const 1))))';
        var json = parser.parse(wast);
        var result = lib.generate(json);
        expect(result).to.eq(wast);
        done();
    });
});
