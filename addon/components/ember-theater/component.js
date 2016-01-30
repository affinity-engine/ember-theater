import Ember from 'ember';
import layout from './template';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  Component,
  get,
  isBlank,
  on,
  set
} = Ember;

const { computed: { reads } } = Ember;
const { inject: { service } } = Ember;

export default Component.extend({
  layout,

  'aria-live': 'polite',
  ariaRole: 'region',
  attributeBindings: ['aria-live'],
  classNames: ['ember-theater'],

  multitonServiceManager: service('multiton-service-manager'),
  configService: multitonService('ember-theater/config', 'theaterId'),
  producer: multitonService('ember-theater/producer', 'theaterId'),

  components: reads('producer.components'),
  mediaLoader: reads('configService.attrs.mediaLoader.type'),

  initializeConfig: on('didReceiveAttrs', function() {
    const config = get(this, 'config');
    const theaterId = get(config, 'theaterId') || 'ember-theater-default';

    set(this, 'theaterId', theaterId);

    const mergedConfig = get(this, 'configService').initializeConfig(config);
    const initialComponents = get(mergedConfig, 'producer.components');

    get(this, 'producer.components').addObjects(initialComponents);
  }),

  setMediaIsLoaded: on('init', function() {
    const mediaLoader = get(this, 'mediaLoader');

    set(this, 'mediaIsLoaded', isBlank(mediaLoader));
  }),

  destroyMultitons: on('willDestroyElement', function() {
    const theaterId = get(this, 'theaterId');

    get(this, 'multitonServiceManager').destroyServices(theaterId);
  }),

  actions: {
    startGame() {
      set(this, 'mediaIsLoaded', true);
    }
  }
});
