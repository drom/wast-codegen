#!/usr/bin/env node
'use strict'

const fs = require('fs')
const gen = require('../')
const filename = process.argv.splice(2)[0]

if (filename) {
  const json = require(filename)
  const wast = gen.generate(json)
  process.stdout.write(wast)
} else {
  let incomingJson = ''
  process.stdin.on('readable', () => {
    var chunk = process.stdin.read()
    if (chunk !== null) {
      incomingJson += chunk
    }
  })

  process.stdin.on('end', function () {
    const wast = gen.generate(JSON.parse(incomingJson))
    process.stdout.write(wast)
  })
}

