# wrist [![Build Status](https://travis-ci.org/WebReflection/wrist.svg?branch=master)](https://travis-ci.org/WebReflection/wrist) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/wrist/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/wrist?branch=master)

An easy way to bind or react to properties change.

It also works with `input` elements and their `value` too.

```js
const watcher = wrist.watch(
  // generic Object or DOM element
  generic,
  // the property name to watch
  'propertyName',
  // the callback that will trigger
  // only when property value changes
  function cb(propName, oldVal, newVal) {
    this === generic; // true
    propName;         // "propertyName"
  }
);

// to drop a watcher
watcher.unwatch();

// or via unwatch and same watch signature
wrist.unwatch(generic, 'propName', cb);
```

Each property can have more than one callback registered.

Dual bindings do not interfere with each other.

[Live test page](https://webreflection.github.io/wrist/test/).

- - -

(C) 2017 Andrea Giammarchi - MIT Style License
