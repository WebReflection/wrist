var wrist = require('../wrist');

const post = {
  title: 'JS & DOM data bindings in 2017',
  published: false
};

const title = document.querySelector('input[name=title]');
const published = document.querySelector('input[name=published]');

wrist.watch(post, 'title', (prop, old, val) => {
  title.value = val;
});
wrist.watch(post, 'published', (prop, old, val) => {
  published.checked = val;
});

wrist.watch(title, 'value', (prop, old, val) => {
  post.title = val;
});
wrist.watch(published, 'checked', (prop, old, val) => {
  post.published = val;
});

global.post = post;