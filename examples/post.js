var wrist = require('../wrist');

var post = {
  title: '',
  published: false
};

var title = document.querySelector('input[name=title]');
var published = document.querySelector('input[name=published]');

// bind post properties to related inputs
wrist.watch(post, 'title', function (prop, old, val) {
  title.value = val;
});
wrist.watch(post, 'published', function (prop, old, val) {
  published.checked = val;
});

// bind inputs to post related properties
wrist.watch(title, 'value', function (prop, old, val) {
  post.title = val;
});
wrist.watch(published, 'checked', function (prop, old, val) {
  post.published = val;
});

// for testing purpose through console
global.post = post;