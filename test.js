var test = require('tressa');

if (typeof global === 'undefined') window.global = window;

var WeakMap = global.WeakMap;
delete global.WeakMap;
var wrist = require('./wrist');
global.WeakMap = WeakMap;

var obj = {defined: true};

test.title('wrist');

test(typeof wrist === 'object', 'module status');


test.async(function (done) {
  wrist.watch(obj, 'test', function watcher(prop, prev, curr) {
    test.log('## undefined property');
    test(this === obj, 'correct context');
    test(prop === 'test', 'correct name');
    test(prev === undefined, 'correct old value');
    test(curr === 123, 'correct new value');
    wrist.unwatch(obj, 'test', watcher);
    obj.test = null;
    done();
  });
});

test.async(function (done) {
  wrist.watch(obj, 'defined', function watcher(prop, prev, curr) {
    test.log('## defined property');
    test(this === obj, 'correct context');
    test(prop === 'defined', 'correct name');
    test(prev === true, 'correct old value');
    test(curr === false, 'correct old value');
    wrist.unwatch(obj, 'defined', watcher);
    obj.defined = null;
    done();
  });
});

test.async(function (done) {
  var watcher = wrist.watch(obj, 'self', function (prop, prev, curr) {
    test.log('## watcher.unwatch()');
    test(this === obj, 'correct context');
    test(prop === 'self', 'correct name');
    test(prev === undefined, 'correct old value');
    test(curr === false, 'correct new value');
    watcher.unwatch();
    obj.self = null;
    done();
  });
});

obj.test = 123;
obj.defined = false;
obj.self = false;

test.async(function (done) {
  test.log('## no duplicates');
  var o = {prop: 123};
  var i = 0;
  var watcher = wrist.watch(o, 'prop', function (prop, prev, curr) {
    i++;
    test(this === o, 'correct context');
    test(prop === 'prop', 'correct name');
    test(prev === 123, 'correct old value');
    test(curr === 456, 'correct new value');
  });
  test(i === 0, 'not called yet');
  o.prop = 456;
  o.prop = 456;
  test(i === 1, 'called only once');
  watcher.unwatch();
  done();
});

test.async(function (done) {
  test.log('## inherited setter');
  function Class() {}
  function watch(prop, prev, curr) {
    test(this === o, 'correct context');
    test(prop === 'test', 'correct name');
    test(prev === 0, 'correct old value');
    test(curr === 1, 'correct new value');
  }
  var i = 0;
  Object.defineProperty(Class.prototype, 'test', {
    configurable: true,
    get: function () { return i; },
    set: function (l) { i = l; }
  });
  var o = new Class();
  wrist.watch(o, 'test', watch);
  o.test += 1;
  wrist.unwatch(o, 'test', watch);
  done();
});

test.async(function (done) {
  test.log('## own setter');
  function watch(prop, prev, curr) {
    test(this === o, 'correct context');
    test(prop === 'test', 'correct name');
    test(prev === 0, 'correct old value');
    test(curr === 1, 'correct new value');
  }
  var i = 0;
  var o = Object.defineProperty({}, 'test', {
    configurable: true,
    get: function () { return i; },
    set: function (l) { i = l; }
  });
  wrist.watch(o, 'test', watch);
  o.test += 1;
  wrist.unwatch(o, 'test', watch);
  done();
});

test.async(function (done) {
  test.log('## borrowed setter');
  function watch(prop, prev, curr) {
    ++j;
  }
  var i = 0;
  var j = 0;
  var o = Object.defineProperty({}, 'test', {
    configurable: true,
    get: function () { return i; },
    set: function (l) { i = l; }
  });
  wrist.watch(o, 'test', watch);
  var z = Object.defineProperty({}, 'test',
    Object.getOwnPropertyDescriptor(o, 'test'));
  z.test = 456;
  test(j === 0, 'watcher not involved');
  test(i === 456, 'setter called');
  wrist.unwatch(o, 'test', watch);
  done();
});


test.async(function (done) {
  if (typeof document === 'undefined') {
    require('jsdom').env('<body><input></body>', [], check);
  } else {
    document.body.appendChild(document.createElement('input'));
    check(null, window);
  }
  function check(err, window) {
    test.log('## DOM elements');
    var input = window.document.body.getElementsByTagName('input')[0];
    var value = '';
    var watcher = wrist.watch(input, 'value', function (prop, prev, curr) {
      test(prop === 'value', 'correct name');
      test(prev === value, 'correct old value');
      test(curr === value + '0', 'correct new value');
      value += '0';
    });
    input.value = '0';
    setTimeout(function () {
      input.value += '0';
      setTimeout(function () {
        watcher.unwatch();
        done();
        // for testing purpose only
        window.wrist = wrist;
      }, 1);
    });
  }
});
