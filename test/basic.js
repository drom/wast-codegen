'use strict';

var lib = require('../'),
    expect = require('chai').expect;

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
        }, 2)).to.eq('(i32.add\n  (get_local\n    $x\n  )\n  (get_local\n    $y\n  )\n)');
        done();
    });
});
