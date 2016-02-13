export default {
  title: 'Steven Universe',
  plugins: [
    'ember-theater/director',
    'ember-theater/menu-bar'
  ],
  director: {
    initialSceneId: '1'
  },
  menuBar: {
    plugins: [
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
      'expressions:src'
      // 'sounds:src'
    ]
  }
};
