'use strict';

var lib = require('../');
var parser = require('wast-parser');
var expect = require('chai').expect;

function checker (wast, indent) {
    var json = parser.parse(wast);
    var result = lib.generate(json, indent);
    expect(result).to.eq(wast);
}

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
        checker('(module)');
        done();
    });

    it('param', function (done) {
        checker('(module(func(param i32))(func(param i32)))');
        checker(
`(module
  (func
    (param i32))
  (func
    (param i32)))`, 2);
        done();
    });

    it('literal', function (done) {
        checker('(module(func 0(param i32))(func(param i32)))');
        checker('(module(import "test" "test"))');
        done();
    });

    it('ident', function (done) {
        checker('(module(func $test(param i32))(func(param i32)))');
        done();
    });

    it('param', function (done) {
        checker('(module(func $test(param $i i32))(func(param i32)))');
        done();
    });

    it('result', function (done) {
        checker('(module(func 0(result i32)(i32.const 1)))');
        done();
    });

    it('relop', function (done) {
        checker('(module(func(i32.eq(i32.const 1)(i32.const 1))))');
        done();
    });

    it('blocks', function (done){
        checker(
`(module
  (func
    (block $switch)))`, 2);
        done();
    });

    it('locals', function (done){
        checker(
`(module
  (func
    (local $j i32)))`, 2);
        done();
    });

    it('br_table', function (done) {
        checker(
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
      (get_local $j))))`, 2);
        done();
    });

    it('export1', function (done) {
        checker('(export "memory" memory)');
        done();
    });

    it('memory1', function (done) {
        checker('(memory 1)');
        done();
    });

    it('memory18', function (done) {
        checker('(memory 1 8)');
        done();
    });

    it('store offset alight #16', function (done) {
        checker(
`(i64.store offset=8 align=4
  (get_local $0)
  (i64.const 1))`, 2);
        done();
    });

    it('unop / eqz #14', function (done) {
        checker(`(i32.eqz
  (i32.const 1))`, 2);
        done();
    });

    it('unop / eqz #14', function (done) {
        checker(
`(i32.eqz
  (i32.const 1))`, 2);
        done();
    });

    it('function with type #20', function (done) {
        checker('(func $func1(type $type1)(param i32)(result i32))');
        done();
    });
});
