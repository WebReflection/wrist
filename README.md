# wrist [![Build Status](https://travis-ci.org/WebReflection/wrist.svg?branch=master)](https://travis-ci.org/WebReflection/wrist) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/wrist/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/wrist?branch=master)

An easy way to bind or react to properties change.

It also works with `input` elements and their `value`, `checked`, or `disabled` too.

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

[Live test page](https://webreflection.github.io/wrist/examples/).

[Related post](https://medium.com/@WebReflection/js-dom-data-bindings-in-2017-1545f38cfdc8#.s69edll9v).

### Compatibility

IE9 Desktop, as well as IE9 Mobile in WP7 are the IE baseline.

Every Desktop browser works, and in Firefox case, even Firefox OS 1 does.

However, old stock browsers found in Android 2~4, WebOS, iOS 5 (OK, not stock but same bug) have a WebKit bug that won't make properties like `input.value` be configurable.

In these cases, other regular, non special attributes, would work, but that's kinda missing the point ow wrist.

If you need to support jurassic mobile browsers, please look elsewhere, apologies.

- - -

(C) 2017 Andrea Giammarchi - MIT Style License
