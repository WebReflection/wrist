/*! (C) 2017 Andrea Giammarchi & Claudio D'angelis */

// used to assert conditions
// equivalent of console.assert(...args)
// test(true)
// test(true, 'what am I testing')
function test(condition, message) {
  try {
    console.assert.apply(console, arguments);
    // in order to read or know failures on browsers
    if (!condition) test.exitCode = 1;
    if (typeof message === 'string' && condition) {
      test.console.log('#green(✔) ' + message);
    }
  } catch(error) {
    test.exitCode = 1;
    test.console.error('#red(✖) ' + error);
  }
}

// on top of the test to show a nice title
// test.title('My Library');
test.title = function (title) {
  test.testName = title;
  test.console.info('# ' + title);
  console.time(title);
};

// for asynchronous tests
/*
test.async(done => {
  // later on ...
  test(1);
  setTimeout(() => {
    test(2);
    done();
  });
});
*/
test.async = function (fn, timeout) {
  var timer = setTimeout(
    function () {
      test(false, '*timeout* ' + (fn.name || fn));
    },
    timeout || test.timeout
  );
  fn(function () { clearTimeout(timer); });
};

// default expiring timeout
test.timeout = 10000;

// for synchronous tests (alias)
test.assert = test.sync = test;

// to log Markdown like strings
test.console = require('consolemd');
test.log = test.console.log;

// to end on browsers
test.end = function () {
  var title = test.testName;
  if (title) {
    console.log(Array(title.length + 10).join('─'));
    console.timeEnd(title);
    console.log('');
    test.testName = '';
  }
};

// show stats on exit, if any, on node
if (!process.browser) process.on('exit', function () {
  test.end();
  process.exit(test.exitCode || 0);
});

module.exports = test;
