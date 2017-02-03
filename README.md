# wrist [![Build Status](https://travis-ci.org/WebReflection/wrist.svg?branch=master)](https://travis-ci.org/WebReflection/wrist)

Easy way to bind or react to properties change.

It works with `input` like nodes and their `value` too.

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
  }
);

// to drop a watcher
watcher.unwatch();

// or via unwatch and same watch signature
wrist.unwatch(generic, 'propName', cb);
```

Each property name can have more than callback registered.

Dual bindings do not interfere with each other.

- - -

(C) 2017 Andrea Giammarchi - MIT Style License
