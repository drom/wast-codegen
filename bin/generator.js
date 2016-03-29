#!/usr/bin/env node
'use strict';

var spec = require('wast-spec'),
    esprima = require('esprima'),
    esotope = require('esotope');

var unparented = {
    'identifier': true,
    'literal': true
    // TODO add the rest
};

var compositeName = {
    binop: 'node.type + \'.\' + node.operator',
    cvtop: 'node.type + \'.\' + node.operator + \'/\' + node.type1',
    const: 'node.type + \'.const\'',
    identifier: '\'$\' + node.name'
    // TODO add the rest
};

var arrayKeys = {
    body: true,
    params: true,
    exprs: true,
    items: true,
    segment: true
};

function parse (str) {
    return esprima.parse(str).body[0];
}

function accGen (right) {
    return {
        type: 'ExpressionStatement',
        expression: {
           type: 'AssignmentExpression',
           operator: '+=',
           left: { type: 'Identifier', name: 'res' },
           right: right
       }
   };
}

function bodyGen (obj, kind) {
    var res = [];
    if (unparented[kind] === undefined) {
        res.push(accGen({ type: 'Literal', value: '(' }));
    }
    if (compositeName[kind] === undefined) {
        res.push(accGen({ type: 'Literal', value: kind }));
    } else {
        res.push(accGen(parse(compositeName[kind]).expression));
    }
    obj[kind].forEach(function (key) {
        if (arrayKeys[key] === undefined) {
            res.push(parse(
                `if (node.${key}) {
                    res += ' ';
                    exprGen[node.${key}.kind](node.${key});
                }`
            ));
        } else {
            res.push(parse(
                `node.${key}.forEach(function (e) {
                    res += ' ';
                    exprGen[e.kind](e);
                });`
            ));
        }
    });
    if (unparented[kind] === undefined) {
        res.push(accGen({ type: 'Literal', value: ')' }));
    }
    return res;
}

function funcObject (obj) {
    var res = esprima.parse(`
        'use strict';
        var res;
        var exprGen = {};
        function gen (node) {
            res = '';
            exprGen[node.kind](node);
            return res;
        }
        exports.generate = gen;
    `);
    var body = res.body[2].declarations[0].init.properties;
    Object.keys(obj).forEach(function (kind) {
        body.push({
            type: 'Property',
            key: { type: 'Identifier', name: kind },
            value: {
                type: 'FunctionExpression',
                params: [{ type: 'Identifier', name: 'node' }],
                defaults: [],
                body: {
                    type: 'BlockStatement',
                    body: bodyGen(obj, kind)
                }
            }
        });
    });
    return res;
}

console.log(esotope.generate(funcObject(spec.visitorKeys)));
