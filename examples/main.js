var wrist = require('../wrist');

var input1 = document.body.appendChild(
  document.createElement('input')
);

var input2 = document.body.appendChild(
  document.createElement('input')
);

function changeValue1(prop, prev, curr) {
  input1[prop] = curr;
}

function changeValue2(prop, prev, curr) {
  input2[prop] = curr;
}

function changeGlobalTest(prop, prev, curr) {
  global.test[prop] = curr;
}

global.test = {};

wrist.watch(input1, 'value', changeValue2);
wrist.watch(input1, 'value', changeGlobalTest);

wrist.watch(input2, 'value', changeValue1);
wrist.watch(input2, 'value', changeGlobalTest);

wrist.watch(global.test, 'value', changeValue1);
wrist.watch(global.test, 'value', changeValue2);

global.test.value = 'change value';

try { console.log('try: test.value = 132;'); } catch(o_O) {}
