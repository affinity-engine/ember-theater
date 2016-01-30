import backdrops from './fixtures/backdrops';
import characterExpressions from './fixtures/character-expressions';
import characters from './fixtures/characters';
import sounds from './fixtures/sounds';

export default {
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
      'ember-theater/menu-bar/reset'
    ]
  },
  mediaLoader: {
    type: 'ember-theater/curtain',
    filesToPreload: [
      'backdrops:src',
      'character-expressions:src'
      // 'sounds:src'
    ]
  },
  fixtures: {
    backdrops,
    characterExpressions,
    characters,
    sounds
  }
};
