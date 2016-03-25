'use strict';

var res = '';

var exprGen = {
    assert_invalid: function (node) { // ['module', 'failure' ],
        res += '(assert_invalid';
        res += ' ';
        exprGen[node.module.kind](node.module);
        res += ' ';
        exprGen[node.failure.kind](node.failure);
        res += ')';
    },
    assert_return: function (node) { // ['invoke', 'expr' ],
        res += '(assert_return';
        res += ' ';
        exprGen[node.invoke.kind](node.invoke);
        if (node.expr) {
            res += ' ';
            exprGen[node.expr.kind](node.expr);
        }
        res += ')';
    },
    assert_return_nan: function (node) { // ['invoke' ],
        res += '(assert_return_nan';
        res += ' ';
        exprGen[node.invoke.kind](node.invoke);
        res += ')';
    },
    assert_trap: function (node) { // ['invoke', 'failure' ],
        res += '(assert_trap';
        res += ' ';
        exprGen[node.invoke.kind](node.invoke);
        res += ' ';
        exprGen[node.failure.kind](node.failure);
        res += ')';
    },
    binop: function (node) { // ['left', 'right' ],
        res += '(' + node.type + '.' + node.operator;
        res += ' ';
        exprGen[node.left.kind](node.left);
        res += ' ';
        exprGen[node.right.kind](node.right);
        res += ')';
    },
    block: function (node) { // ['body' ],
        res += '(block';
        node.body.forEach(function (e) {
            res += ' ';
            exprGen[e.kind](e);
        });
        res += ')';
    },
    br: function (node) { // ['id', 'expr' ],
        res += '(br';
        res += ' ';
        exprGen[node.id.kind](node.id);
        if (node.expr) {
            res += ' ';
            exprGen[node.expr.kind](node.expr);
        }
        res += ')';
    },
    br_if: function (node) { // ['id', 'test', 'expr' ],
        res += '(br_if';
        res += ' ';
        exprGen[node.id.kind](node.id);
        res += ' ';
        exprGen[node.test.kind](node.test);
        if (node.expr) {
            res += ' ';
            exprGen[node.expr.kind](node.expr);
        }
        res += ')';
    },
    br_table: function (node) { // ['expr', 'body' ],
        res += '(br_table';
        // FIXME expr should be an Object
        node.expr.forEach(function (e) {
            res += ' ';
            exprGen[e.kind](e);
        });
        node.body.forEach(function (e) {
            res += ' ';
            exprGen[e.kind](e);
        });
        res += ')';
    },
    call: function (node) { // ['id', 'expr' ],
        res += '(call';
        res += ' ';
        exprGen[node.id.kind](node.id);
        // FIXME expr should be an Object
        node.expr.forEach(function (e) {
            res += ' ';
            exprGen[e.kind](e);
        });
        res += ')';
    },
    call_import: function (node) { // ['id', 'expr' ],
        res += '(call_import';
        res += ' ';
        exprGen[node.id.kind](node.id);
        // FIXME expr should be an Object
        node.expr.forEach(function (e) {
            res += ' ';
            exprGen[e.kind](e);
        });
        res += ')';
    },
    call_indirect: function (node) { // ['id', 'expr' ],
        res += '(call_indirect';
        res += ' ';
        exprGen[node.id.kind](node.id);
        // FIXME expr should be an Object
        node.expr.forEach(function (e) {
            res += ' ';
            exprGen[e.kind](e);
        });
        res += ')';
    },
    const: function (node) { // [ ],
        res += '(' + node.type + '.const ' + node.init + ')';
    },
    cvtop: function (node) { // ['expr' ],
        res += '(' + node.type + '.' + node.operator + '/' + node.type1;
        res += ' ';
        exprGen[node.expr.kind](node.expr);
        res += ')';
    },
    else: function (node) { // ['id', 'body' ],
        res += '(else';
        if (node.id) {
            res += ' ';
            exprGen[node.id.kind](node.id);
        }
        node.body.forEach(function (e) {
            res += ' ';
            exprGen[e.kind](e);
        });
        res += ')';
    },
    export: function (node) { // [ 'name', 'id' ],
        res += '(export';
        res += ' ';
        exprGen[node.name.kind](node.name);
        res += ' ';
        if (node.id.kind) {
            exprGen[node.id.kind](node.id);
        } else {
            res += '"' + node.id + '"';
        }
        res += ')';
    },
    // FIXME ugly named string
    failure: function (node) { // [ ],
        res += '"' + node.value + '"';
    },
    func: function (node) { // ['id', 'param', 'result', 'body' ],
        res += '(func';
        if (node.id) {
            res += ' ';
            exprGen[node.id.kind](node.id);
        }
        node.param.forEach(function (e) {
            res += ' ';
            exprGen[e.kind](e);
        });
        if (node.result) {
            res += ' ';
            exprGen[node.result.kind](node.result);
        }
        node.body.forEach(function (e) {
            res += ' ';
            exprGen[e.kind](e);
        });
        res += ')';
    },
    get_local: function (node) { // ['id' ],
        res += '(get_local';
        res += ' ';
        exprGen[node.id.kind](node.id);
        res += ')';
    },
    grow_memory: function (node) { // ['expr' ],
        res += '(grow_memory';
        res += ' ';
        exprGen[node.expr.kind](node.expr);
        res += ')';
    },
    identifier: function (node) { // [ ],
        res += '$' + node.name;
    },
    if: function (node) { // ['test', 'consequent', 'alternate' ],
        res += '(if';
        res += ' ';
        exprGen[node.test.kind](node.test);
        res += ' ';
        exprGen[node.consequent.kind](node.consequent);
        if (node.alternate) {
            res += ' ';
            exprGen[node.alternate.kind](node.alternate);
        }
        res += ')';
    },
    import: function (node) { // ['id', 'modName', 'funcName', 'params' ],
        res += '(import';
        res += ' ';
        exprGen[node.modName.kind](node.modName);
        res += ' ';
        exprGen[node.funcName.kind](node.funcName);
        if (node.id) {
            res += ' ';
            exprGen[node.id.kind](node.id);
        }
        node.params.forEach(function (e) {
            res += ' ';
            exprGen[e.kind](e);
        });
        res += ')';
    },
    invoke: function (node) { // ['body' ],
        res += '(invoke';
        res += ' ';
        res += '"' + node.name + '"';
        node.body.forEach(function (e) {
            res += ' ';
            exprGen[e.kind](e);
        });
        res += ')';
    },
    item: function (node) { // [ ],
        res += node.type + '.' + node.name;
    },
    literal: function (node) { // [ ],
        res += node.value;
    },
    load: function (node) { // ['expr' ],
        res += '(load';
        res += ' ';
        exprGen[node.expr.kind](node.expr);
        res += ')';
    },
    local: function (node) { // ['items' ],
        res += '(local';
        node.items.forEach(function (e) {
            res += ' ';
            exprGen[e.kind](e);
        });
        res += ')';
    },
    loop: function (node) { // ['body', 'extra' ],
        res += '(loop';
        node.body.forEach(function (e) {
            res += ' ';
            exprGen[e.kind](e);
        });
        if (node.extra) {
            res += ' ';
            exprGen[node.extra.kind](node.extra);
        }
        res += ')';
    },
    memory: function (node) { // ['segment' ],
        res += '(memory';
        res += ')';
    },
    memory_size: function (node) { // [ ],
        res += '(memory_size';
        res += ')';
    },
    module: function (node) { // ['body' ],
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
    nop: function (node) { // [ ],
        res += '(nop)';
    },
    param: function (node) { // ['items' ],
        res += '(param';
        res += ')';
    },
    relop: function (node) { // ['left', 'right' ],
        res += '(';
        res += ')';
    },
    result: function (node) { // [ ],
        res += '(result ';
        res += node.type;
        res += ')';
    },
    return: function (node) { // ['expr' ],
        res += '(return';
        res += ')';
    },
    script: function (node) { // ['body' ],
        node.body.forEach(function (e) {
            exprGen[e.kind](e);
            res += '\n';
        });
    },
    segment: function (node) { // [ 'name' ],
        res += '(segment';
        res += ' ';
        exprGen[node.name.kind](node.name);
        res += ')';
    },
    select: function (node) { // ['test', 'consequent', 'alternate' ],
        res += '(select';
        res += ')';
    },
    set_local: function (node) { // ['id', 'init' ],
        res += '(set_local';
        res += ')';
    },
    start: function (node) { // ['id' ],
        res += '(start';
        res += ')';
    },
    store: function (node) { // ['addr', 'data' ],
        res += '(store';
        res += ')';
    },
    table: function (node) { // ['items' ],
        res += '(table';
        res += ')';
    },
    then: function (node) { // ['id', 'body' ],
        res += '(then';
        node.body.forEach(function (e) {
            res += ' ';
            exprGen[e.kind](e);
        });
        res += ')';
    },
    type: function (node) { // ['id' ],
        res += '(type';
        res += ')';
    },
    unop: function (node) { // ['expr' ],
        res += '(';
        res += ')';
    },
    unreachable: function (node) { // [ ]
        res += '(unreachable)';
    }
};

function gen (node) {
    exprGen[node.kind](node);
    return res;
}

exports.generate = gen;
