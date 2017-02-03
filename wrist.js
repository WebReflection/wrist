/*! (C) 2017 Andrea Giammarchi - MIT Style License */
var wrist = (function (O) {'use strict';
  var
    ADD_EVENT = 'addEventListener',
    REMOVE_EVENT = 'removeEventListener',
    SECRET = '__oO()' + Math.random(),
    empty = {},
    hOP = empty.hasOwnProperty,
    dP = O.defineProperty,
    gOPD = O.getOwnPropertyDescriptor,
    gPO = O.getPrototypeOf,
    gD = function (o, p) {
      if (p in o) {
        while (o && !hOP.call(o, p)) o = gPO(o);
        if (o) return gOPD(o, p);
      }
    },
    wm = typeof WeakMap == 'function' ?
      new WeakMap :
      {
        get: function (a, b) {
          return hOP.call(a, SECRET) ?
            a[SECRET] : b;
        },
        set: function (a, b) {
          dP(a, SECRET, {value: b});
        }
      }
  ;

  function Wrist() {}
  Wrist.prototype = Object.create(null);

  function createWrist(object) {
    var wrist = new Wrist;
    wm.set(object, wrist);
    return wrist;
  }

  function createWatcher(object, wrist, prop) {
    var
      set = function ($) {
        var i, length, old;
        if (this === object) {
          if (value !== $) {
            old = value;
            value = $;
            setter.call(object, value);
            i = 0;
            length = callbacks.length;
            while (i < length)
              callbacks[i++].call(object, prop, old, value);
          }
        } else {
          setter.call(this, value);
        }
      },
      callbacks = [],
      descriptor = gD(object, prop) || empty,
      getter = descriptor.get || function () { return value; },
      setter = descriptor.set || function ($) { value = $; },
      value = hOP.call(descriptor, 'value') ?
        descriptor.value : getter.call(object)
    ;

    return (wrist[prop] = {
      // ignored descriptor properties
      _: callbacks,
      d: descriptor === empty ? null : descriptor,
      h: function (e) { set.call(e.target, object[prop]); },
      // regular descriptors properties
      configurable: true,
      enumerable: hOP.call(descriptor, 'enumerable') ?
        descriptor.enumerable :
        (String(prop)[0] !== '_'),
      get: getter,
      set: set
    });
  }

  function unwatch(object, prop, callback) {
    var wrist = wm.get(object), callbacks, i, watcher;
    if (wrist && prop in wrist) {
      watcher = wrist[prop];
      callbacks = watcher._;
      i = callbacks.indexOf(callback);
      if (-1 < i) {
        callbacks.splice(i, 1);
        if (callbacks.length < 1) {
          delete wrist[prop];
          if (watcher.d) {
            dP(object, prop, watcher.d);
          } else {
            delete object[prop];
            object[prop] = watcher.get.call(object);
          }
          if (REMOVE_EVENT in object) {
            object[REMOVE_EVENT]('change', watcher.h, false);
            object[REMOVE_EVENT]('input', watcher.h, false);
          }
        }
      }
    }
  }

  return {
    watch: function watch(object, prop, callback) {
      var
        wrist = wm.get(object) || createWrist(object),
        watcher = wrist[prop] || createWatcher(object, wrist, prop),
        callbacks = watcher._
      ;
      if (callbacks.indexOf(callback) < 0) {
        callbacks.push(callback);
        dP(object, prop, watcher);
        if (ADD_EVENT in object) {
          object[ADD_EVENT]('change', watcher.h, false);
          object[ADD_EVENT]('input', watcher.h, false);
        }
      }
      return {unwatch: unwatch.bind(null, object, prop, callback)};
    },
    unwatch: unwatch
  };

}(Object));

try { module.exports = wrist; } catch(o_O) {}
