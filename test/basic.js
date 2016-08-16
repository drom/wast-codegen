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

        expect(generated).to.eq(expected);
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
        var wast = '(module(func(param i32))(func(param i32)))';
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
        var wast = '(module(func 0(param i32))(func(param i32)))';
        var json = parser.parse(wast);
        var result = lib.generate(json);
        expect(result).to.eq(wast);

        wast = '(module(import "test" "test"))';
        json = parser.parse(wast);
        result = lib.generate(json);
        expect(result).to.eq(wast);
        done();
    });

    it('ident', function (done) {
        var wast = '(module(func $test(param i32))(func(param i32)))';
        var json = parser.parse(wast);
        var result = lib.generate(json);
        expect(result).to.eq(wast);

        done();
    });

    it('param', function (done) {
        var wast = '(module(func $test(param $i i32))(func(param i32)))';
        var json = parser.parse(wast);
        var result = lib.generate(json);
        expect(result).to.eq(wast);

        done();
    });

    it('result', function (done) {
        var wast = '(module(func 0(result i32)(i32.const 1)))';
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

    it('blocks', function (done){
        var wast =
`(module
  (func
    (block $switch)))`;

        var json = parser.parse(wast);
        var result = lib.generate(json, 2);
        expect(result).to.eq(wast);
        done();
    });

    it('locals', function (done){
        var wast =
`(module
  (func
    (local $j i32)))`;

        var json = parser.parse(wast);
        var result = lib.generate(json, 2);
        expect(result).to.eq(wast);
        done();
    });

    it('br_table', function (done) {
        var wast =
`(module
  (func $stmt
    (param $i i32)
    (result i32)
    (local $j i32)
    (set_local $j
      (i32.const 100))
    (block $switch
      (block $7
        (block $default
          (block $6
            (block $5
              (block $4
                (block $3
                  (block $2
                    (block $1
                      (block $0
                        (br_table $0 $1 $2 $3 $4 $5 $6 $7 $default
                          (get_local $i)))
                      (return
                        (get_local $i)))
                    (nop)))
                (set_local $j
                  (i32.sub
                    (i32.const 0)
                    (get_local $i)))
                (br $switch))
              (br $switch))
            (set_local $j
              (i32.const 101))
            (br $switch))
          (set_local $j
            (i32.const 101)))
        (set_local $j
          (i32.const 102))))
    (return
      (get_local $j))))`;

        var json = parser.parse(wast);
        var result = lib.generate(json, 2);
        expect(result).to.eq(wast);
        done();
    });

    it('export1', function (done) {
        var wast = '(export "memory" memory)';
        var json = parser.parse(wast);
        var result = lib.generate(json, 2);
        expect(result).to.eq(wast);
        done();
    });

    it('memory1', function (done) {
        var wast = '(memory 1)';
        var json = parser.parse(wast);
        var result = lib.generate(json, 2);
        expect(result).to.eq(wast);
        done();
    });

    it('memory18', function (done) {
        var wast = '(memory 1 8)';
        var json = parser.parse(wast);
        var result = lib.generate(json, 2);
        expect(result).to.eq(wast);
        done();
    });

    it('store offset alight #16', function (done) {
        var wast = `(i64.store offset=8 align=4
  (get_local $0) (i64.const 1))`;
        var json = parser.parse(wast);
        var result = lib.generate(json, 2);
        expect(result).to.eq(wast);
        done();
    });

    it('unop / eqz #14', function (done) {
        var wast = `(i32.eqz
  (i32.const 1))`;
        var json = parser.parse(wast);
        var result = lib.generate(json, 2);
        expect(result).to.eq(wast);
        done();
    });

});
