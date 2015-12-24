'use strict';

var lib = require('../lib'),
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
        })).to.eq('(i32.add (get_local $x) (get_local $y))');
        done();
    });
});
