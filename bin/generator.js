#!/usr/bin/env node
'use strict';

var spec = require('wast-spec'),
    esprima = require('esprima'),
    esotope = require('esotope');

var unparented = {
    identifier: true,
    literal: true,
    script: true,
    item: true
    // TODO add the rest
};

var compositeName = {
    binop: 'node.type + \'.\' + node.operator',
    cvtop: 'node.type + \'.\' + node.operator + \'/\' + node.type1',
    const: 'node.type + \'.const \' + node.init',
    identifier: '\'$\' + node.name',
    item: '(node.name ? \'$\' + node.name : \'\') + node.type',
    script: '\'(; ;)\''
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

function bodyGen (obj, kind) {
    var objKinds = obj[kind],
        res = [];
    res.push(parse(`res += indent`));
    if (unparented[kind] === undefined) {
        res.push(parse(`res += '('`));
    }
    if (compositeName[kind] === undefined) {
        res.push(parse(`res += '${kind}'`));
    } else {
        res.push(parse('res += ' + compositeName[kind]));
    }
    if (objKinds.length > 0) {
        res.push(parse(`indent += '  '`));
        objKinds.forEach(function (key) {
            if (arrayKeys[key] === undefined) {
                res.push(parse(
                    `if (node.${key}) {
                        exprGen[node.${key}.kind](node.${key});
                    }`
                ));
            } else {
                res.push(parse(
                    `node.${key}.forEach(function (e) {
                        exprGen[e.kind](e);
                    });`
                ));
            }
        });
        res.push(parse(`indent = indent.slice(0,-2)`));
        if (unparented[kind] === undefined) {
            res.push(parse(`res += indent`));
        }
    }
    if (unparented[kind] === undefined) {
        res.push(parse(`res += ')'`));
    }
    return res;
}

function funcObject (obj) {
    var res = esprima.parse(`
        'use strict';
        var res, indent;
        var exprGen = {};
        function gen (node) {
            res = '';
            indent = '\\n';
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
