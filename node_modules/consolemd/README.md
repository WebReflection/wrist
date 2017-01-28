# consolemd [![build status](https://travis-ci.org/WebReflection/consolemd.svg)](https://travis-ci.org/WebReflection/consolemd)
The [echomd](https://github.com/WebReflection/echomd) conversion tool for browsers and console.

```js
// overwritten in browsers if loaded without browserify
// otherwise, in CommonJS env (avoids overwrite)
var console = require('consolemd');

console.log('what a *bold* solution!');

console.log(`
# Bringing MD Like Syntax To Console
It should be something as **easy**
and as _natural_ as writing text.

> Kepp It Simple

Is the idea

  * behind
  * all this

~striking~ UX for \`shell\` users too.
- - -
#green(Enjoy)
`);
```

Please note if you want to use original version of a method you can `console.log.raw('do *it*')`.

**MIT Style License**
