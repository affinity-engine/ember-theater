import Ember from 'ember';
import multiService from 'ember-theater/macros/ember-theater/multi-service';

const {
  Mixin,
  get,
  isPresent,
  on,
  set
} = Ember;

const { computed: { alias } } = Ember;
const { inject: { service } } = Ember;

export default Mixin.create({
  stageManagers: service('ember-theater/director/stage-manager'),

  stageManager: multiService('stageManagers'),

  autoResolve: alias('directable.autoResolve'),
  autoResolveResult: alias('directable.autoResolveResult'),

  associateDirectable: on('didInitAttrs', function() {
    const directable = get(this, 'directable');

    set(directable, 'component', this);
  }),

  resolve(...args) {
    get(this, 'directable').resolve(...args);
  },

  resolveAndDestroy(...args) {
    const directable = get(this, 'directable');
    const stageManager = get(this, 'stageManager');

    this.resolve(...args);
    // directable.destroy();

    get(stageManager, 'directables').removeObject(directable);
  },

  destroyDirectable: on('willDestroyElement', function() {
    const directable = get(this, 'directable');

    if (isPresent(directable)) {
      directable.destroy();
    }
  })
});
