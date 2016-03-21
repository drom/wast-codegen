'use strict'

const exprGen = {
  assert_invalid: function (node) { // ['module', 'failure' ],
    return `(assert_invalid ${exprGen[node.module.kind](node.module)}` +
      ` ${exprGen[node.failure.kind](node.failure)} )`
  },
  assert_return: function (node) { // ['invoke', 'expr' ],
    let res = `(assert_return ${exprGen[node.invoke.kind](node.invoke)}`
    if (node.expr) {
      res += ' ' + exprGen[node.expr.kind](node.expr)
    }
    res += ')'
    return res
  },
  assert_return_nan: function (node) { // ['invoke' ],
    let res = '(assert_return_nan'
    res += ' ' + exprGen[node.invoke.kind](node.invoke)
    res += ')'
    return res
  },
  assert_trap: function (node) { // ['invoke', 'failure' ],
    return `(assert_trap ' ${exprGen[node.invoke.kind](node.invoke)} ` +
      `${exprGen[node.failure.kind](node.failure)})`
  },
  binop: function (node) { // ['left', 'right' ],
    return `(${node.type}.${node.operator} ` +
      `${exprGen[node.left.kind](node.left)} ` +
      `${exprGen[node.right.kind](node.right)})`
  },
  block: function (node) { // ['body' ],
    return `(block ${node.body.map((e) => exprGen[e.kind](e)).join(' ')})`
  },
  br: function (node) { // ['id', 'expr' ],
    let res = `(br ${exprGen[node.id.kind](node.id)}`
    if (node.expr) {
      res += ' ' + exprGen[node.expr.kind](node.expr)
    }
    res += ')'
    return res
  },
  br_if: function (node) { // ['id', 'test', 'expr' ],
    let res = '(br_if'
    res += ' ' + exprGen[node.id.kind](node.id)
    res += ' ' + exprGen[node.test.kind](node.test)
    if (node.expr) {
      res += ' ' + exprGen[node.expr.kind](node.expr)
    }
    res += ')'
    return res
  },
  br_table: function (node) { // ['expr', 'body' ],
    let res = '(br_table'
    res += node.expr.map((e) => exprGen[e.kind](e)).join(' ')
    res += node.body.map((e) => exprGen[e.kind](e)).join(' ')
    res += ')'
    return res
  },
  call: function (node) { // ['id', 'expr' ],
    let res = `(call ${exprGen[node.id.kind](node.id)} `
    res += node.expr.map((e) => exprGen[e.kind](e)).join(' ')
    res += ')'
    return res
  },
  call_import: function (node) { // ['id', 'expr' ],
    let res = '(call_import'
    res += ' ' + exprGen[node.id.kind](node.id)
      // FIXME expr should be an Object
    res += node.expr.map((e) => exprGen[e.kind](e)).join(' ')
    res += ')'
    return res
  },
  call_indirect: function (node) { // ['id', 'expr' ],
    let res = '(call_indirect'
    res += ' ' + exprGen[node.id.kind](node.id)
    res += node.expr.map((e) => exprGen[e.kind](e)).join(' ')
    res += ')'
    return res
  },
  const: function (node) { // [ ],
    return `(${node.type}.const ${node.init})`
  },
  cvtop: function (node) { // ['expr' ],
    return `( ${node.type}.${node.operator}/${node.type1}` +
    ` ${exprGen[node.expr.kind](node.expr)})`
  },
  else: function (node) { // ['id', 'body' ],
    let res = '(else'
    if (node.id) {
      res += ' ' + exprGen[node.id.kind](node.id)
    }
    res += node.body.map((e) => exprGen[e.kind](e)).join(' ')
    res += ')'
    return res
  },
  export: function (node) { // ['name' 'id' ],
    let res = `(export "${node.name}" `
    if (node.id.kind) {
      res += exprGen[node.id.kind](node.id)
    } else {
      res += `"${node.id}"`
    }
    res += ')'
    return res
  },
  failure: function (node) { // [ ],
    return `"${node.value}"`
  },
  func: function (node) { // ['id', 'param', 'result', 'body' ],
    let res = '(func '
    if (node.id) {
      res += ' ' + exprGen[node.id.kind](node.id)
    }
    res += node.param.map((e) => exprGen[e.kind](e)).join(' ')
    if (node.result) {
      res += ' ' + exprGen[node.result.kind](node.result)
    }
    res += node.body.map((e) => exprGen[e.kind](e)).join(' ')
    res += ')'
    return res
  },
  get_local: function (node) { // ['id' ],
    return `(get_local ${exprGen[node.id.kind](node.id)})`
  },
  grow_memory: function (node) { // ['expr' ],
    let res = '(grow_memory'
    res += ' ' + exprGen[node.expr.kind](node.expr)
    res += ')'
    return res
  },
  identifier: function (node) { // [ ],
    return `$${node.id}`
  },
  if: function (node) { // ['test', 'consequent', 'alternate' ],
    let res = `(if ${exprGen[node.test.kind](node.test)}` +
      ` ${exprGen[node.consequent.kind](node.consequent)}`

    if (node.alternate) {
      res += ' ' + exprGen[node.alternate.kind](node.alternate)
    }
    res += ')'
    return res
  },
  import: function (node) { // ['id', 'name1', 'name2', 'params' ],
    let res = '(import ${exprGen[node.name1.kind](node.name1)} ${exprGen[node.name2.kind](node.name2)}'
    if (node.id) {
      res += ' ' + exprGen[node.id.kind](node.id)
    }
    res += node.params.map((e) => exprGen[e.kind](e)).join(' ')
    res += ')'
    return res
  },
  invoke: function (node) { // ['body' ],
    return `(invoke "${node.name}" ${node.body.map((e) => exprGen[e.kind](e)).join(' ')})`
  },
  item: function (node) { // [ ],
    let item = node.type
    if (node.name) {
      item += `.${node.name}`
    }
    return item
  },
  literal: function (node) { // [ ],
    return node.value
  },
  load: function (node) { // ['expr' ],
    return `(load ${exprGen[node.expr.kind](node.expr)})`
  },
  local: function (node) { // ['items' ],
    return `(local ${node.body.map((e) => exprGen[e.kind](e)).join(' ')})`
  },
  loop: function (node) { // ['body', 'extra' ],
    let res = `(loop ${node.body.map((e) => exprGen[e.kind](e)).join(' ')}`
    if (node.extra) {
      res += ' ' + exprGen[node.extra.kind](node.extra)
    }
    res += ')'
    return res
  },
  memory: function (node) { // ['segment' ],
    return '(memory)'
  },
  memory_size: function (node) { // [ ],
    return '(memory_size)'
  },
  module: function (node) { // ['body' ],
    let i, body, len, kind
    let res = '(module'
    body = node.body
    len = body.length
    for (i = 0; i < len; i++) {
      kind = body[i].kind
      res += ' ' + exprGen[kind](body[i])
    }
    res += ')'
    return res
  },
  nop: function (node) { // [ ],
    return '(nop)'
  },
  param: function (node) { // ['items' ],
    return `(param ${node.items.map((item) => exprGen[item.kind](item)).join(' ')})`
  },
  relop: function (node) { // ['left', 'right' ],
    return `(${node.type}.${node.operator} ${exprGen[node.left.kind](node.left)}` +
      ` ${exprGen[node.right.kind](node.right)})`
  },
  result: function (node) { // [ ],
    return `(result ${node.type})`
  },
  return: function (node) { // ['expr' ],
    return '(return)'
  },
  script: function (node) { // ['body' ],
    let res = ''
    node.body.forEach(function (e) {
      res += exprGen[e.kind](e)
      res += '\n'
    })
    return res
  },
  segment: function (node) { // ['name'],
    return `(segment) ${exprGen[node.name.kind](node.name)}`
  },
  select: function (node) { // ['test', 'consequent', 'alternate' ],
    return '(select)'
  },
  set_local: function (node) { // ['id', 'init' ],
    return '(set_local)'
  },
  start: function (node) { // ['id' ],
    return '(start)'
  },
  store: function (node) { // ['addr', 'data' ],
    return '(store)'
  },
  table: function (node) { // ['items' ],
    return '(table)'
  },
  then: function (node) { // ['id', 'body' ],
    return `(then ${node.body.map((e) => exprGen[e.kind](e)).join(' ')})`
  },
  type: function (node) { // ['id' ],
    return '(type)'
  },
  unop: function (node) { // ['expr' ],
    return '()'
  },
  unreachable: function (node) { // [ ]
    return '(unreachable)'
  }
}

function gen (node) {
  return exprGen[node.kind](node)
}

exports.generate = gen
