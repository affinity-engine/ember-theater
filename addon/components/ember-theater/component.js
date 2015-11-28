import Ember from 'ember';
import layout from './template';

const {
  Component,
  get,
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

  config: service('ember-theater/config'),
  producer: service('ember-theater/producer'),

  components: reads('producer.components'),
  mediaLoader: reads('config.mediaLoader.type'),

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
