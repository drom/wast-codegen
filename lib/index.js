'use strict';

var res = '';

var exprGen = {
    assert_invalid: function (node, options) { // ['module', 'failure' ],
    },
    assert_return: function (node, options) { // ['invoke', 'expr' ],
    },
    assert_return_nan: function (node, options) { // ['invoke' ],
    },
    assert_trap: function (node, options) { // ['invoke', 'failure' ],
    },
    binop: function (node, options) { // ['left', 'right' ],
    },
    block: function (node, options) { // ['body' ],
    },
    br: function (node, options) { // ['id', 'expr' ],
    },
    br_if: function (node, options) { // ['id', 'test', 'expr' ],
    },
    br_table: function (node, options) { // ['expr', 'body' ],
    },
    call: function (node, options) { // ['id', 'expr' ],
    },
    call_import: function (node, options) { // ['id', 'expr' ],
    },
    call_indirect: function (node, options) { // ['id', 'expr' ],
    },
    const: function (node, options) { // [ ],
    },
    cvtop: function (node, options) { // ['expr' ],
    },
    else: function (node, options) { // ['id', 'body' ],
    },
    export: function (node, options) { // ['id' ],
    },
    failure: function (node, options) { // [ ],
    },
    func: function (node, options) { // ['id', 'param', 'result', 'body' ],
        var i, e, body, len, kind;
        res += '\n(func';

        e = node.id;
        if (e && exprGen[e.kind]) {
            res += ' ';
            exprGen[e.kind](e);
        }

        e = node.result;
        if (e && exprGen[e.kind]) {
            res += ' ';
            exprGen[e.kind](e);
        }

        body = node.body;
        len = body.length;
        for (i = 0; i < len; i++) {
            kind = body[i].kind;
            res += ' ';
            exprGen[kind](body[i]);
        }
        res += ')';
    },
    get_local: function (node, options) { // ['id' ],
    },
    grow_memory: function (node, options) { // ['expr' ],
    },
    identifier: function (node, options) { // [ ],
        res += '$';
        res += node.name;
    },
    if: function (node, options) { // ['test', 'consequent', 'alternate' ],
    },
    import: function (node, options) { // ['id', 'params' ],
    },
    invoke: function (node, options) { // ['body' ],
    },
    item: function (node, options) { // [ ],
    },
    literal: function (node, options) { // [ ],
        res += node.value;
    },
    load: function (node, options) { // ['expr' ],
    },
    local: function (node, options) { // ['items' ],
    },
    loop: function (node, options) { // ['body', 'extra' ],
    },
    memory: function (node, options) { // ['segment' ],
    },
    memory_size: function (node, options) { // [ ],
    },
    module: function (node, options) { // ['body' ],
        var i, body, len, kind;
        res += '(module';
        body = node.body;
        len = body.length;
        for (i = 0; i < len; i++) {
            kind = body[i].kind;
            res += ' ';
            exprGen[kind](body[i]);
        }
        res += ')';
    },
    nop: function (node, options) { // [ ],
    },
    param: function (node, options) { // ['items' ],
    },
    relop: function (node, options) { // ['left', 'right' ],
    },
    result: function (node, options) { // [ ],
        if (node) {
            res += '(result ';
            res += node.type;
            res += ')';
        }
    },
    return: function (node, options) { // ['expr' ],
    },
    script: function (node, options) { // ['body' ],
        var i, body, len, kind;
        res += '\n(script';
        body = node.body;
        len = body.length;
        for (i = 0; i < len; i++) {
            kind = body[i].kind;
            res += ' ';
            exprGen[kind](body[i]);
        }
        res += ')';
    },
    segment: function (node, options) { // [ ],
    },
    select: function (node, options) { // ['test', 'consequent', 'alternate' ],
    },
    set_local: function (node, options) { // ['id', 'init' ],
    },
    start: function (node, options) { // ['id' ],
    },
    store: function (node, options) { // ['addr', 'data' ],
    },
    table: function (node, options) { // ['items' ],
    },
    then: function (node, options) { // ['id', 'body' ],
    },
    type: function (node, options) { // ['id' ],
    },
    unop: function (node, options) { // ['expr' ],
    },
    unreachable: function (node, options) { // [ ]
        res += '(unreachable)';
    }
};

function gen (node) {
    var kind = node.kind;
    //     res = kind;

    exprGen[kind](node);

    // switch (kind) {
    //
    // case 'return':
    // case 'unop':
    // case 'cvtop':
    // case 'load':
    //     res += ' ' + gen(node.expr);
    //     break;
    //
    // case 'binop':
    // case 'relop':
    //     res = node.type + '.' + node.operator + ' '
    //         + gen(node.left) + ' ' + gen(node.right);
    //     break;
    //
    // case 'get_local':
    //     res += ' ' + gen(node.id);
    //     break;
    //
    // case 'identifier':
    //     return '$' + node.id;
    //
    // case 'module':
    // case 'script':
    // case 'case':
    // case 'invoke':
    //     res += ' ' + node.body.map(gen).join(' ');
    //     break;
    //
    // }
    // return '(' + res + ')';
    return '\n\n' + res + '\n';
}

exports.generate = gen;
