export default {
  theaterId: 'demo-2',
  title: 'Steven Universe',
  globals: {
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
      'ember-theater/menu-bar/reset',
      'ember-theater/menu-bar/resize'
    ]
  },
  mediaLoader: {
    type: 'ember-theater/curtain',
    filesToPreload: [
      'backdrops:src',
      'character-expressions:src'
      // 'sounds:src'
    ]
  }
};
