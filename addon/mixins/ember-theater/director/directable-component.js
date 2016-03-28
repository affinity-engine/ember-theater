import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  Mixin,
  get,
  isPresent,
  on,
  set
} = Ember;

const { computed: { alias } } = Ember;
const { run: { next } } = Ember;

export default Mixin.create({
  stageManager: multitonService('ember-theater/director/stage-manager', 'theaterId', 'windowId'),

  priorSceneRecord: alias('directable.priorSceneRecord'),

  associateDirectable: on('didInitAttrs', function() {
    const directable = get(this, 'directable');

    set(directable, 'component', this);
  }),

  resolve() {
    get(this, 'directable').resolve(get(this, 'directable.direction'));
  },

  resolveAndDestroy() {
    const directable = get(this, 'directable');
    const direction = get(directable, 'direction');
    const stageManager = get(this, 'stageManager');
    const resolve = get(this, 'directable').resolve;

    get(stageManager, 'directables').removeObject(directable);

    next(() => {
      resolve(direction);
    });
  }
});
