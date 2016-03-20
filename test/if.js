'use strict'

const lib = require('../lib')
const expect = require('chai').expect

describe('basic', function () {
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

  it('t0', function (done) {
    expect(lib.generate(json)).to.eq('(if (i64.eq (call_import $test) (i64.const 5)) (br 0))')
    done()
  })
})
