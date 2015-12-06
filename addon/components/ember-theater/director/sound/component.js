import Ember from 'ember';
import DirectableComponentMixin from 'ember-theater/mixins/directable-component';

const {
  Component,
  get,
  getProperties,
  inject,
  isPresent,
  on,
  set
} = Ember;

const { inject: { service } } = Ember;

export default Component.extend(DirectableComponentMixin, {
  soundManager: service('ember-theater/sound-manager'),
  store: service('store'),

  instantiateSound: on('didInsertElement', function() {
    const soundManager = get(this, 'soundManager');
    const audioId = get(this, 'directable.audioId');
    const instance = soundManager.createInstance(audioId);

    set(this, 'instance', instance);
  }),

  executeEffect: on('didRender', function() {
    const {
      directable,
      instance,
      soundManager
    } = getProperties(this, 'directable', 'instance', 'soundManager');

    const {
      effect,
      options
    } = getProperties(directable, 'effect', 'options');

    soundManager[effect](instance, options);

    soundManager.on(instance, 'complete', () => {
      this.resolveAndDestroy();
    });
  }),

  teardown: on('willDestroyElement', function() {
    const {
      instance,
      soundManager
    } = getProperties(this, 'instance', 'soundManager');

    soundManager.fadeOut(instance);
  })
});
