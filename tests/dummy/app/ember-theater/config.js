export default {
  title: 'Steven Universe',
  globals: {
    decorativeClassNames: ['et-coastal'],
    keys: {
      accept: ['a']
    }
  },
  producer: {
    components: [
      'ember-theater/director',
      'ember-theater/menu-bar'
    ]
  },
  director: {
    initialScene: '1'
  },
  menuBar: {
    components: [
      'ember-theater/menu-bar/rewind',
      'ember-theater/menu-bar/load',
      'ember-theater/menu-bar/save',
      'ember-theater/menu-bar/reset'
    ]
  },
  mediaLoader: {
    type: 'ember-theater/curtain',
    mediaAttributes: [
      'ember-theater/backdrop:src',
      'ember-theater/character-expression:src'
      // 'ember-theater/sound:src'
    ]
  }
};
