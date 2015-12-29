export default {
  priority: 0,
  title: 'Steven Universe',
  globals: {
    decorativeClassNames: ['et-coastal'],
    keys: {
      accept: ['a']
    }
  },
  initial: {
    sceneId: 1,
    components: [
      'ember-theater/director',
      'ember-theater/menu-bar'
    ],
    emberTheaterMenuBar: [
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
      'ember-theater/character-expression:src',
      // 'ember-theater/sound:src'
    ]
  }
};
