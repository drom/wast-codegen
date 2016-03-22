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

### CLI
First install globally `npm i wast-codegen   -g`
Then invoke with an AST json file `wast-codegen <path/to/json/file>`  
Alternatively you can use stdin `cat ast.json | wast-codegen`

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
