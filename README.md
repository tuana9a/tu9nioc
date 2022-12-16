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
  test3;
}

class Test3 {}

const ioc = new tu9nioc.IOCContainer();
ioc.addClass(Test1, "test1");
ioc.addClass(Test2, "test2");
ioc.addClass(Test3, "test3");
ioc.di(); // start dependency injection

const test1 = ioc.getBean("test1").getInstance();
const test2 = ioc.getBean("test2").getInstance();
const test3 = ioc.getBean("test3").getInstance();

console.log(test1.test2 == test2); // true
console.log(test2.test3 == test3); // true
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
