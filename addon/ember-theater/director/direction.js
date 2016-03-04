import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  K,
  computed,
  get,
  getOwner,
  getProperties,
  isPresent,
  set
} = Ember;

const { RSVP: { Promise } } = Ember;
const { run: { next } } = Ember;

export default Ember.Object.extend({
  attrs: computed(() => Ember.Object.create({ instance: 0 })),

  sceneManager: multitonService('ember-theater/director/scene-manager', 'theaterId'),
  stageManager: multitonService('ember-theater/director/stage-manager', 'theaterId'),

  instance(instance) {
    set(this, 'attrs.instance', instance);

    return this;
  },

  _instanceComponent: computed({
    get() {
      const instanceId = get(this, 'attrs.instance');
      const {
        componentPath,
        id,
        stageManager
      } = getProperties(this, 'componentPath', 'id', 'stageManager');

      const directable = stageManager.findDirectableWithId(id, componentPath, instanceId);

      return isPresent(directable) ? get(directable, 'component') : undefined;
    }
  }).volatile(),

  _addToQueue() {
    const queue = get(this, 'queue') || set(this, 'queue', Ember.A());

    if (!queue.contains(this)) {
      queue.unshiftObject(this);

      this._queueGo();
    }
  },

  _queueGo() {
    const goIsExecuted = new Promise((resolve) => {
      next(() => {
        if (get(this, 'queue').indexOf(this) === 0) {
          set(this, 'promise', this._go());
        }

        resolve();
      });
    });

    set(this, 'goIsExecuted', goIsExecuted);
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

  then: async function(...args) {
    await get(this, 'goIsExecuted');

    return get(this, 'promise').then(...args);
  },

  _go() {
    const {
      queue,
      scene,
      sceneManager
    } = getProperties(this, 'queue', 'scene', 'sceneManager');

    const meta = getProperties(this, 'autoResolve', 'autoResolveResult');

    const promise = new Promise((resolve) => {
      queue.forEach((direction, index) => {
        direction._resolveDirection(index, meta, resolve);
      });
    });

    sceneManager.recordSceneRecordEvent(promise, scene);

    return promise;
  },

  _resolveDirection(index, meta, resolve) {
    const resolveOrK = index === 0 ? resolve : K;

    this._perform(meta, resolveOrK);
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
