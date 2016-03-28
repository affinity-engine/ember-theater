import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  get,
  isPresent,
  merge,
  set
} = Ember;

export default Direction.extend({
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

  _perform(...args) {
    const attrs = get(this, 'attrs');

    if (isPresent(get(attrs, 'sceneWindowId'))) {
      return this._super(...args);
    } else {
      const sceneId = get(attrs, 'sceneId');

      this.get('sceneManager').toScene(sceneId, attrs);
    }
  }
});
