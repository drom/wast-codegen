'use strict';

function gen (node) {
    var kind = node.kind,
        res = kind;

    switch (kind) {

    case 'return':
    case 'unop':
    case 'cvtop':
    case 'load':
        res += ' ' + gen(node.expr);
        break;

    case 'binop':
    case 'relop':
        res = node.type + '.' + node.operator + ' '
            + gen(node.left) + ' ' + gen(node.right);
        break;

    case 'get_local':
        res += ' ' + gen(node.id);
        break;

    case 'identifier':
        return '$' + node.id;

    case 'module':
    case 'script':
    case 'case':
    case 'invoke':
        res += ' ' + node.body.map(gen).join(' ');
        break;

    }
    return '(' + res + ')';
}

exports.generate = gen;
