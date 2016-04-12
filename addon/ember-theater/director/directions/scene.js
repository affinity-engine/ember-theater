import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import BusPublisherMixin from 'ember-theater/mixins/bus-publisher';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  get,
  getProperties,
  isPresent,
  merge,
  set
} = Ember;

export default Direction.extend(BusPublisherMixin, {
  componentPath: 'ember-theater/director/directable/scene-window',
  layer: 'windows',

  sceneManager: multitonService('ember-theater/director/scene-manager', 'theaterId', 'windowId'),

  _setup(sceneId) {
    this._entryPoint();

    set(this, 'attrs.sceneId', sceneId);

    return this;
  },

  _reset() {
    const attrs = get(this, 'attrs');

    return this._super(getProperties(attrs, 'sceneWindowId', 'window'));
  },

  autosave(autosave = true) {
    this._entryPoint();

    set(this, 'attrs.autosave', autosave);

    return this;
  },

  transitionIn(effect, duration, options = {}) {
    this._entryPoint();

    set(this, 'attrs.transitionIn', merge({ duration, effect }, options));

    return this;
  },

  transitionOut(effect, duration, options = {}) {
    this._entryPoint();

    set(this, 'attrs.transitionOut', merge({ duration, effect }, options));

    return this;
  },

  window(sceneWindowId) {
    set(this, 'attrs.window', this);
    set(this, 'attrs.sceneWindowId', sceneWindowId);

    return this;
  },

  classNames(classNames) {
    this._entryPoint();

    set(this, 'attrs.classNames', classNames);

    return this;
  },

  close() {
    const theaterId = get(this, 'theaterId');
    const sceneWindowId = get(this, 'attrs.sceneWindowId');

    this.publish(`et:${theaterId}:${sceneWindowId}:closingWindow`);

    return this;
  },

  priority(priority) {
    this._entryPoint();

    set(this, 'attrs.priority', priority);

    return this;
  },

  screen(screen = true) {
    this._entryPoint();

    set(this, 'attrs.screen', screen);

    return this;
  },

  _perform(...args) {
    const attrs = get(this, 'attrs');

    if (isPresent(get(attrs, 'sceneWindowId'))) {
      return this._super(...args);
    } else if (isPresent(get(attrs, 'sceneId'))) {
      const sceneId = get(attrs, 'sceneId');

      this.get('sceneManager').toScene(sceneId, attrs);
    }
  }
});
