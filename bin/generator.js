#!/usr/bin/env node
'use strict';

var spec = require('wast-spec'),
    esprima = require('esprima'),
    esotope = require('esotope');

// remove script
delete spec.visitorKeys['script'];

var unparented = {
    identifier: true,
    literal: true,
    item: true
    // TODO add the rest
};

var type_operator = "node.type + '.' + node.operator";

var compositeName = {
    unop:  type_operator,
    binop: type_operator,
    relop: type_operator,
    cvtop: type_operator + " + '/' + node.type1",
    const: "node.type + '.const ' + node.init",

    load:  `node.type
        + '.load'
        + (node.size || '')
        + ((node.sign === true)  ? '_s' : '')
        + ((node.sign === false) ? '_u' : '')
        + (node.offset ? (' offset=' + node.offset) : '')
        + (node.align ? (' align=' + node.align) : '')
        `,

    store: `node.type
        + '.store'
        + (node.size || '')
        + (node.offset ? (' offset=' + node.offset) : '')
        + (node.align ? (' align=' + node.align) : '')
        `,

    identifier: "'$' + node.name",

    item: "(node.name ? '$' + node.name + ' ': '') + node.type",

    literal: `Number.isInteger(node.value)
        ? node.value
        : (node.bare ? node.value : ('"' + node.value + '"'))`,

    result: "'result ' + node.type"
    // TODO add the rest
};

var arrayKeys = {
    body: true,
    params: true,
    exprs: true,
    items: true,
    segment: true,
    local: true
};

function parse (str) {
    return esprima.parse(str).body[0];
}

function bodyGen (obj, kind) {
    var objKinds = obj[kind],
        res = [];
    if (unparented[kind] === undefined) {
        res.push(parse("res += indent"));
        res.push(parse("res += '('"));
    } else {
        res.push(parse("res += ' '"));
    }
    if (compositeName[kind] === undefined) {
        res.push(parse(`res += '${kind}'`));
    } else {
        res.push(parse(`res += ${compositeName[kind]}`));
    }
    if (objKinds.length > 0) {
        res.push(parse("indent += spaceString"));
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
        res.push(parse("indent = indent.slice(0,-spaceNum)"));
    }
    if (unparented[kind] === undefined) {
        res.push(parse("res += ')'"));
    }
    return res;
}

function funcObject (obj) {
    var res = esprima.parse(`
        'use strict';
        var res, indent, spaceNum, spaceString;
        var exprGen = {};
        function gen (node, space) {
            res = '';
            spaceString = ''
            spaceNum = space
            if (space) {
              for(var i=0; i<space; i++){
                spaceString += ' '
              }
              indent = '\\n';
            } else {
              indent = ''
            }

            // remove script
            if(node.kind === 'script'){
              node.body.forEach(function(n){
                exprGen[n.kind](n);
              })
            }else{
              exprGen[node.kind](node);
            }

            // trims leading newline
            if (space) {
              res = res.slice(1)
            }
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
/* eslint quotes: 0 */
