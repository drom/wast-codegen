[![NPM version](https://img.shields.io/npm/v/wast-codegen.svg)](https://www.npmjs.org/package/wast-codegen)
[![Travis](https://travis-ci.org/drom/wast-codegen.svg)](https://travis-ci.org/drom/wast-codegen)
[![appVeyor](https://ci.appveyor.com/api/projects/status/l3ijsytrhmf42k6o?svg=true)](https://ci.appveyor.com/project/drom/wast-codegen)

# WebAssembly code generator

Generates S-expression WebAssembly from ([AST](https://github.com/drom/wast-spec))

## Use

### Node.js

```sh
npm i wast-codegen --save
```
```js
var codegen = require('wast-codegen');
```

## Functions

### .generate()

```js
var src = codegen.generate({
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
});
```

produces string `(i32.add (get_local $x) (get_local $y)`

## Testing

```sh
npm test
```

## License
MIT [LICENSE](https://github.com/drom/wast-codegen/blob/master/LICENSE).

