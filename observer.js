var observer = (function (O) {'use strict';

  /*! (C) 2017 Andrea Giammarchi - MIT Style License */
  var
    empty = {},
    ADD_EVENT = 'addEventListener',
    REMOVE_EVENT = 'removeEventListener',
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
      callbacks = [],
      descriptor = gD(object, prop) || empty,
      value = descriptor.value,
      setter = descriptor.set || function ($) { value = $; },
      watcher = {
        _: callbacks,
        d: descriptor === empty ? null : descriptor,
        handleEvent: function (e) {
          set.call(e.target, object[prop]);
        },
        configurable: hOP.call(descriptor, 'configurable') ?
          descriptor.configurable :
          true,
        enumerable: hOP.call(descriptor, 'enumerable') ?
          descriptor.enumerable :
          (prop.charAt(0) === '_'),
        get: descriptor.get || function () { return value; },
        set: set
      }
    ;

    function set($) {
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
    }

    return (observer[prop] = watcher);
  }

  function unwatch(object, prop, callback) {
    var observer = wm.get(object), i, watcher;
    if (observer) {
      watcher = observer[prop];
      i = watcher._.indexOf(callback);
      if (-1 < i) watcher._.splice(i, 1);
      if (watcher._.length < 1) {
        if (watcher.d) {
          dP(object, prop, watcher.d);
        } else {
          delete object[prop];
          object[prop] = watcher.get.call(object);
        }
        if (REMOVE_EVENT in object) {
          object[REMOVE_EVENT]('change', watcher, false);
          object[REMOVE_EVENT]('input', watcher, false);
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
          object[ADD_EVENT]('change', watcher, false);
          object[ADD_EVENT]('input', watcher, false);
        }
      }
      return {unwatch: unwatch.bind(null, object, prop, callback)};
    },
    unwatch: unwatch
  };

}(Object));

try { module.exports = observer; } catch(o_O) {}
