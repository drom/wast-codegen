'use strict'

const lib = require('../lib')
const expect = require('chai').expect

describe('basic', function () {
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

  it('test literals', function (done) {
    expect(lib.generate(json)).to.eq('(call 0 (i64.sub (get_local 0) (i64.const 1)))')
    done()
  })
})
