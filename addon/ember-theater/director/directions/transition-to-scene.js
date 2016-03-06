import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  get,
  merge,
  set
} = Ember;

export default Direction.extend({
  sceneManager: multitonService('ember-theater/director/scene-manager', 'theaterId'),

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

  _perform() {
    const attrs = get(this, 'attrs');
    const sceneId = get(attrs, 'sceneId');

    this.get('sceneManager').toScene(sceneId, attrs);
  }
});
