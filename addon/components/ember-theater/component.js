import Ember from 'ember';
import layout from './template';

const {
  Component,
  get,
  getProperties,
  isBlank,
  on,
  set
} = Ember;

const { inject: { service } } = Ember;
const { computed: { reads } } = Ember;

export default Component.extend({
  'aria-live': 'polite',
  ariaRole: 'region',
  attributeBindings: ['aria-live'],
  classNames: ['ember-theater'],
  layout: layout,

  configService: service('ember-theater/config'),
  producer: service('ember-theater/producer'),

  components: reads('producer.components'),
  mediaLoader: reads('configService.mediaLoader.type'),

  initializeConfig: on('didReceiveAttrs', function() {
    const {
      config,
      configService
    } = getProperties(this, 'config', 'configService');

    configService.setGameConfig(config);
    configService.resetConfig();
  }),

  setMediaIsLoaded: on('init', function() {
    const mediaLoader = get(this, 'mediaLoader');

    set(this, 'mediaIsLoaded', isBlank(mediaLoader));
  }),

  actions: {
    startGame() {
      set(this, 'mediaIsLoaded', true);
    }
  }
});
