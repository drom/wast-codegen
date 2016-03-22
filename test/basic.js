'use strict'

const lib = require('../lib')
const expect = require('chai').expect

describe('basic', function () {
  it('t0', function (done) {
    expect(lib.generate({
      kind: 'binop',
      type: 'i32',
      operator: 'add',
      left: {
        kind: 'get_local',
        id: {
          kind: 'identifier',
          id: 'x'
        }
      },
      right: {
        kind: 'get_local',
        id: {
          kind: 'identifier',
          id: 'y'
        }
      }
    })).to.eq('(i32.add (get_local $x) (get_local $y))')
    done()
  })

  it('if', function (done) {
    const json = {
      'kind': 'if',
      'test': {
        'kind': 'relop',
        'type': 'i64',
        'operator': 'eq',
        'left': {
          'kind': 'call_import',
          'id': {
            'kind': 'identifier',
            'id': 'test'
          },
          'expr': []
        },
        'right': {
          'kind': 'const',
          'type': 'i64',
          'init': '5'
        }
      },
      'consequent': {
        'kind': 'br',
        'id': {
          'kind': 'literal',
          'value': 0,
          'raw': '0'
        },
        'expr': null
      },
      'alternate': null
    }
    expect(lib.generate(json)).to.eq('(if (i64.eq (call_import $test) (i64.const 5)) (br 0))')
    done()
  })

  it('test function params', function (done) {
    const json = {
      'kind': 'func',
      'id': null,
      'type': null,
      'param': [{
        'kind': 'param',
        'items': [{
          'kind': 'item',
          'type': 'i64'
        }]
      }],
      'result': {
        'kind': 'result',
        'type': 'i64'
      },
      'local': [],
      'body': []
    }
    expect(lib.generate(json)).to.eq('(func (param i64) (result i64))')
    done()
  })

  it('test literals', function (done) {
    const json = {
      'kind': 'call',
      'id': {
        'kind': 'literal',
        'value': 0,
        'raw': '0'
      },
      'expr': [{
        'kind': 'binop',
        'type': 'i64',
        'operator': 'sub',
        'left': {
          'kind': 'get_local',
          'id': {
            'kind': 'literal',
            'value': 0,
            'raw': '0'
          }
        },
        'right': {
          'kind': 'const',
          'type': 'i64',
          'init': '1'
        }
      }]
    }
    expect(lib.generate(json)).to.eq('(call 0 (i64.sub (get_local 0) (i64.const 1)))')
    done()
  })
})
