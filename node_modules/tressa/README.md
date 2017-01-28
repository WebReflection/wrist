# tressa [![build status](https://secure.travis-ci.org/WebReflection/tressa.svg)](http://travis-ci.org/WebReflection/tressa)

A little test utility from [Andrea Giammarchi](https://twitter.com/WebReflection) and [Claudio D'angelis](https://twitter.com/daw985) born after [this post](https://medium.com/@WebReflection/js-vanilla-test-code-coverage-7b7ba3740776#.piaeqe6k3) and [this tweet](https://twitter.com/daw985/status/821280929276686336).

Compatible with NodeJS 0.8 and higher.

```js
var test = require('tressa');

test.title('My Library');

// synchronous
test(condition, 'optional comment');

// asynchronous
test.async(done => {
  setTimeout(() => {
    test(condition, 'optional comment');
    done();
  });
});
```

(C) 2017 MIT Style License
