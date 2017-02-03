var test = require('tressa');
var wrist = require('./wrist');

var obj = {defined: true};

test.title('wrist');

test(typeof wrist === 'object', 'module status');


test.async(function (done) {
  wrist.watch(obj, 'test', function watcher(prop, prev, curr) {
    test.log('## undefined property');
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


if (typeof document) {
  test.async(function (done) {
    var input = document.body.appendChild(document.createElement('input'));
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
  });
}
