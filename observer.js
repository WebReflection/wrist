var observer = (function (O) {'use strict';

  /*! (C) 2017 Andrea Giammarchi - MIT Style License */
  var
    ADD_EVENT = 'addEventListener',
    REMOVE_EVENT = 'removeEventListener',
    empty = {},
    wm = new WeakMap(),
    hOP = empty.hasOwnProperty,
    dP = O.defineProperty,
    gOPD = O.getOwnPropertyDescriptor,
    gPO = O.getPrototypeOf,
    gD = function (o, p) {
      if (p in o) {
        while (o && !hOP.call(o, p)) o = gPO(o);
        if (o) return gOPD(o, p);
      }
    }
  ;

  function createObserver(object) {
    var observer = Object.create(null);
    wm.set(object, observer);
    return observer;
  }

  function createWatcher(object, observer, prop) {
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

    return (observer[prop] = {
      // ignored descriptor properties
      _: callbacks,
      d: descriptor === empty ? null : descriptor,
      h: function (e) { set.call(e.target, object[prop]); },
      // regular descriptors properties
      configurable: true,
      enumerable: hOP.call(descriptor, 'enumerable') ?
        descriptor.enumerable :
        (String(prop).charAt(0) !== '_'),
      get: getter,
      set: set
    });
  }

  function unwatch(object, prop, callback) {
    var observer = wm.get(object), i, watcher;
    if (observer && prop in observer) {
      watcher = observer[prop];
      i = watcher._.indexOf(callback);
      if (-1 < i) watcher._.splice(i, 1);
      if (watcher._.length < 1) {
        delete observer[prop];
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

  return {
    watch: function watch(object, prop, callback) {
      var
        observer = wm.get(object) || createObserver(object),
        watcher = observer[prop] || createWatcher(object, observer, prop),
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

try { module.exports = observer; } catch(o_O) {}
