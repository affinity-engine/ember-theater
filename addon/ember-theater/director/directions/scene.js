import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import BusPublisherMixin from 'ember-theater/mixins/ember-theater/bus-publisher';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  get,
  isPresent,
  merge,
  set
} = Ember;

export default Direction.extend(BusPublisherMixin, {
  componentPath: 'ember-theater/director/directable/scene-window',
  layer: 'windows',

  sceneManager: multitonService('ember-theater/director/scene-manager', 'theaterId', 'windowId'),

  setup(sceneId) {
    this._entryPoint();

    set(this, 'attrs.sceneId', sceneId);

    return this;
  },

  autosave(autosave = true) {
    set(this, 'attrs.autosave', autosave);

    return this;
  },

  transitionOut(effect, duration, options = {}) {
    set(this, 'attrs.transitionOut', merge({ duration, effect }, options));

    return this;
  },

  window(sceneWindowId) {
    set(this, 'attrs.sceneWindowId', sceneWindowId);

    return this;
  },

  classNames(classNames) {
    set(this, 'attrs.classNames', classNames);

    return this;
  },

  close() {
    const windowId = get(this, 'windowId');

    this.publish(`et:${windowId}:closeWindow`);

    return this;
  },

  priority(priority) {
    set(this, 'attrs.priority', priority);

    return this;
  },

  screen(screen = true) {
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
