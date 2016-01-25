import Ember from 'ember';
import layout from './template';
import multiService from 'ember-theater/macros/ember-theater/multi-service';

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
  producers: service('ember-theater/producer'),

  producer: multiService('producers', 'theaterId'),
  components: reads('producer.components'),
  configInstance: multiService('configService', 'theaterId'),
  mediaLoader: reads('configInstance.mediaLoader.type'),

  initializeConfig: on('didReceiveAttrs', function() {
    const {
      config,
      configService
    } = getProperties(this, 'config', 'configService');

    const mergedConfig = configService.resetConfig(config);
    const initialComponents = get(mergedConfig, 'producer.components');
    const theaterId = get(mergedConfig, 'theaterId');

    set(this, 'theaterId', theaterId);
    get(this, 'producers').createInstance(theaterId, {
      components: Ember.A(initialComponents)
    });
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
