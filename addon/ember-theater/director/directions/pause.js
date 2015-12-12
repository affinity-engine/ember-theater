import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';

const {
  get,
  set,
  typeOf
} = Ember;

const { inject: { service } } = Ember;

export default Direction.extend({
  layer: 'meta.pause',

  stageManager: service('ember-theater/director/stage-manager'),

  perform(resolve, ...args) {
    const keys = Ember.A();

    args.forEach((arg) => {
      switch (typeOf(arg)) {
        case 'string': return keys.pushObject(arg);
        case 'number': return set(this, 'duration', arg);
      }
    });

    const duration = get(this, 'duration');
    const layer = get(options, 'layer') || get(this, 'layer');
    const autoResolve = get(this, 'autoResolve');

    const properties = {
      autoResolve,
      keys,
      duration,
      layer
    };

    get(this, 'stageManager').handleDirectable(null, 'pause', properties, resolve);
  }
});
