import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import DirectionQueue from './direction-queue';

const {
  K,
  computed,
  get,
  getOwner,
  getProperties,
  isPresent,
  set
} = Ember;

export default Ember.Object.extend({
  attrs: computed(() => Ember.Object.create({ instance: 0 })),

  sceneManager: multitonService('ember-theater/director/scene-manager', 'theaterId'),
  stageManager: multitonService('ember-theater/director/stage-manager', 'theaterId'),

  delay(delay) {
    set(this, 'attrs.delay', delay);

    return this;
  },

  instance(instance) {
    set(this, 'attrs.instance', instance);

    return this;
  },

  _$instance: computed({
    get() {
      const instanceId = get(this, 'attrs.instance');
      const {
        componentPath,
        id,
        stageManager
      } = getProperties(this, 'componentPath', 'id', 'stageManager');

      const directable = stageManager.findDirectableWithId(id, componentPath, instanceId);

      return isPresent(directable) ? get(directable, 'component').$() : undefined;
    }
  }).volatile(),

  then: async function(...args) {
    await get(this, 'queue.allDirectionsAreLoaded');

    return get(this, 'queue.executionComplete').then(...args);
  },

  _createDirection(name) {
    const meta = get(this, '_directionMeta');

    return getOwner(this).lookup(`direction:${name}`).create(meta);
  },

  _directionMeta: computed({
    get() {
      return getProperties(this, 'autoResolve', 'autoResolveResult', 'queue', 'scene', 'theaterId');
    }
  }).readOnly().volatile(),

  _addToQueue() {
    const queue = get(this, 'queue') || set(this, 'queue', DirectionQueue.create({
      scene: get(this, 'scene'),
      sceneManager: get(this, 'sceneManager'),
      autoResolve: get(this, 'autoResolve'),
      autoResolveResult: get(this, 'autoResolveResult')
    }));

    if (!queue.contains(this)) {
      queue.unshiftObject(this);
      queue.startCountdown(this);
    }
  },

  _perform(meta, resolve) {
    const {
      attrs,
      componentPath,
      id,
      layer,
      stageManager
    } = getProperties(this, 'attrs', 'componentPath', 'id', 'layer', 'stageManager');

    stageManager.handleDirectable(id, componentPath, { attrs, layer, ...meta }, resolve);
  }
});
