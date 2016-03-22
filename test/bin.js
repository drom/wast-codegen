'use strict'
const expect = require('chai').expect
const execFile = require('child_process').execFile

describe('bin', function () {
  it('bin should generate from file', function (done) {
    execFile(__dirname + '/../bin/wast-codegen.js', [__dirname + '/../test/test.json'], (error, stdout, stderr) => {
      expect(stdout).to.equal('(if (i64.eq (call_import $test) (i64.const 5)) (br 0))')
      done()
    })
  })
})
