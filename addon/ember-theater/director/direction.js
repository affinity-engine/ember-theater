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
  _shouldReset: true,

  attrs: computed(() => Ember.Object.create({ instance: 0 })),

  sceneManager: multitonService('ember-theater/director/scene-manager', 'theaterId'),
  stageManager: multitonService('ember-theater/director/stage-manager', 'theaterId'),

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
    const _this = this;

    _this.then = async function(...args) {
      await get(_this, 'queue.allDirectionsAreLoaded');

      delete _this.then;

      return get(_this, 'queue.executionComplete').then(...args);
    };
  },

  _createDirection(name) {
    const meta = get(this, '_directionMeta');

    return getOwner(this).lookup(`direction:${name}`).create(meta);
  },

  _directionMeta: computed({
    get() {
      return getProperties(this, 'autoResolve', 'autoResolveResult', 'queue', 'script', 'theaterId');
    }
  }).readOnly().volatile(),

  _addToQueue() {
    const queue = get(this, 'queue') || set(this, 'queue', DirectionQueue.create({
      script: get(this, 'script'),
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

    set(this, '_shouldReset', true);

    stageManager.handleDirectable(id, componentPath, { attrs, layer, direction: this, ...meta }, resolve);
  }
});
