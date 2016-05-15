import Ember from 'ember';
import multiton from 'ember-multiton-service';
import DirectionQueue from './direction-queue';

const {
  computed,
  get,
  getOwner,
  getProperties,
  isPresent,
  set
} = Ember;

export default Ember.Object.extend({
  _isDirection: true,
  _shouldReset: true,

  attrs: computed(() => Ember.Object.create({ instance: 0 })),

  sceneManager: multiton('ember-theater/director/scene-manager', 'theaterId', 'windowId'),
  stageManager: multiton('ember-theater/director/stage-manager', 'theaterId', 'windowId'),

  delay(delay) {
    set(this, 'attrs.delay', delay);

    return this;
  },

  _$instance: computed({
    get() {
      const component = get(this, 'directable.component');

      return isPresent(component) ? component.$() : undefined;
    }
  }).volatile(),

  _entryPoint() {
    if (get(this, '_shouldReset')) {
      this._reset();
    }

    this._convertToPromise();
    this._addToQueue();

    return this;
  },

  _reset(attrs) {
    set(this, '_shouldReset', false);
    set(this, '_hasDefaultTransition', false);
    set(this, 'attrs', Ember.Object.create(attrs));
    set(this, 'queue', undefined);
  },

  _convertToPromise() {
    const that = this;

    that.then = function(...args) {
      return get(that, 'queue.allDirectionsAreLoaded').then(() => {
        return get(that, 'queue.executionComplete').then(...args);
      });
    };

    set(this, 'promise', { then: this.then });
  },

  // allows us to resolve the promise by returning the direction
  _devertFromPromise() {
    Reflect.deleteProperty(this, 'then');
  },

  _createDirection(name) {
    const meta = get(this, '_directionMeta');

    return getOwner(this).lookup(`direction:${name}`).create(meta);
  },

  _directionMeta: computed({
    get() {
      return getProperties(this, 'priorSceneRecord', 'queue', 'script', 'theaterId', 'windowId');
    }
  }).readOnly().volatile(),

  _addToQueue() {
    const queue = get(this, 'queue') || set(this, 'queue', DirectionQueue.create({
      script: get(this, 'script'),
      sceneManager: get(this, 'sceneManager'),
      priorSceneRecord: get(this, 'priorSceneRecord')
    }));

    if (!queue.contains(this)) {
      queue.unshiftObject(this);
      queue.startCountdown(this);
    }
  },

  _perform(priorSceneRecord, resolve) {
    const {
      attrs,
      componentPath,
      id,
      layer,
      stageManager
    } = getProperties(this, 'attrs', 'componentPath', 'id', 'layer', 'stageManager');

    set(this, '_shouldReset', true);

    stageManager.handleDirectable(id, { attrs, componentPath, layer, direction: this, priorSceneRecord }, resolve);
  }
});
