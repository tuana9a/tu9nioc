# tu9nioc

tua**na**9a **N**odeJS **I**nversion **o**f **C**ontrol

a dependency injection for nodejs

# installing

```bash
npm install tu9nioc
```

# how to use

## raw nodejs

### basic

```js
const tu9nioc = require("tu9nioc");

class Test1 {
  test2;
}

class Test2 {
  test3WithOtherName;
}

class Test3 {}

const ioc = new tu9nioc.IOCContainer();
ioc.addClass(Test1); // default name = "test1"
ioc.addClass(Test2, "test2"); // manually set name
ioc.addClass(Test3, "test3WithOtherName");
ioc.di(); // start dependency injection

const test1 = ioc.getBean("test1").getInstance();
const test2 = ioc.getBean(Test2).getInstance(); // get bean by it's class
const test3 = ioc.getBean("test3WithOtherName").getInstance();

console.log(test1.test2 == test2); // true
console.log(test2.test3WithOtherName == test3); // true
```

### ignore props

ignore one

```js
const tu9nioc = require("tu9nioc");

class Test1 {
  test2;
  test3;
}

class Test2 {
  test1;
}

const ioc = new tu9nioc.IOCContainer();
ioc.addClass(Test1, "test1", { ignoreDeps: ["test3"] });
ioc.addClass(Test2, "test2");
ioc.di();

const test1 = ioc.getBean("test1").getInstance();
const test2 = ioc.getBean("test2").getInstance();

console.log(test1.test2 == test2); // true
console.log(test2.test1 == test1); // true
console.log(test1.test3); // undefined
```

ignore all

```js
class Test1 {
  test2;
  test3;
}

class Test2 {
  test1;
}

const ioc = new tu9nioc.IOCContainer();
ioc.addClass(Test1, "test1", { ignoreDeps: ["__all"] });
ioc.addClass(Test2, "test2");
ioc.di();

const test1 = ioc.getBean("test1").getInstance();
const test2 = ioc.getBean("test2").getInstance();

console.log(test2.test1 == test); // true;
console.log(test1.test3); // undefined;
console.log(test1.test2); // undefined;
```

### auto scan using global ioc

`Test1.js`

```js
const { ioc } = require("tu9nioc");

class Test1 {
  test2;
}

ioc.addClass(Test1, "test1");

module.exports = Test1;
```

`Test2.js`

```js
const { ioc } = require("tu9nioc");

class Test2 {
  test1;
}

ioc.addClass(Test2, "test2");

module.exports = Test2;
```

`main.js`

```js
const { ioc } = require("tu9nioc");

// need auto scan because of lazy load of nodejs
ioc.autoScan(".", {
  absolute: true,
  fileNameFilter: (fileName) => fileName.match(/test\d\.js/),
  dirNameFilter: (dirName) => dirName != "node_modules" && dirName != ".git",
});
ioc.di();

const test1 = ioc.getBean("test1").getInstance();
const test2 = ioc.getBean("test2").getInstance();

console.log(test1.test2 == test2); // true
console.log(test2.test1 == test1); // true
```

### inject getter and setter

getter

```js
class Test1 {
  test2;
}

class Test2 {
  test1;
}

const ioc = new tu9nioc.IOCContainer({ getter: true });
ioc.addClass(Test1, "test1");
ioc.addClass(Test2, "test2");
ioc.di();

const test1 = ioc.getBean("test1").getInstance();
const test2 = ioc.getBean("test2").getInstance();

console.log(test1.test2 == test2); // true
console.log(test2.test1 == test1); // true
console.log(test1.getTest2() == test2); // true
console.log(test2.getTest1() == test1); // true
```

setter

```js
class Test1 {
  test2;
}

class Test2 {
  test1;
}

const test3 = new Test2();
test3.test1 = "not-a-real-test1";

const ioc = new tu9nioc.IOCContainer({ setter: true });
ioc.addClass(Test1, "test1");
ioc.addClass(Test2, "test2");
ioc.di();

const test1 = ioc.getBean("test1").getInstance();
const test2 = ioc.getBean("test2").getInstance();

console.log(test1.test2 == test2); // true
console.log(test2.test1 == test1); // true
test1.setTest2(test3);
console.log(test1.test2.test1 == "not-a-real-test1"); // true
```

## typescript

`Class1.ts`

```ts
import { ioc } from "tu9nioc";
import { Class2 } from "./Class2";

export class Class1 {
  class3: Class3; // NOT WORK

  constructor(public class2: Class2 /* OK */) { }
}

ioc.addClass(Class1);
```

`Class2.ts`

```ts
import { ioc } from "tu9nioc";
import { Class1 } from "./Class1";

export class Class2 {
  constructor(public class1: Class1) { }
}

ioc.addClass(Class2);
```

`index.ts`

```ts
import { ioc } from "tu9nioc";
import { Class1 } from "./Class1";
import { Class2 } from "./Class2";

ioc.autoScan(__dirname);
ioc.di();

const c1: Class1 = ioc.getBean("class1").getInstance();
const c2: Class2 = ioc.getBean(Class2).getInstance();

console.log(c1.class2 == c2); // true
console.log(c2.class1 == c1); // true
```

### annotation support

**IMPORTANT** set `experimentalDecorators` to true

```json
{
  "compilerOptions": {
    ...
    "experimentalDecorators": true
  },
  ...
}
```

`Class1.ts`

```ts
import { Component } from "tu9nioc";
import { Class2 } from "./Class2";

@Component
export class Class1 {
  constructor(public class2: Class2) { }
}
```

`Class2.ts`

```ts
import { Component } from "tu9nioc";
import { Class1 } from "./Class1";

@Component
export class Class2 {
  constructor(public class1: Class1) { }
}
```

`index.ts`

```ts
import { ioc } from "tu9nioc";
import { Class1 } from "./Class1";
import { Class2 } from "./Class2";

ioc.scan(__dirname);
ioc.di();

const c1: Class1 = ioc.getBean("class1").getInstance();
const c2: Class2 = ioc.getBean(Class2).getInstance();

console.log(c1.class2 == c2); // true
console.log(c2.class1 == c1); // true
```