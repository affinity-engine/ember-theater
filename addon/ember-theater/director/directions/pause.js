import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';

const {
  get,
  set,
  typeOf
} = Ember;

const { inject: { service } } = Ember;

export default Direction.extend({
  stageManager: service('ember-theater/director/stage-manager'),

  perform(resolve, ...args) {
    const keys = Ember.A();

    args.forEach((arg) => {
      switch (typeOf(arg)) {
        case 'string': return keys.pushObject(arg);
        case 'number': return set(this, 'duration', arg);
      }
    });

    const properties = {
      keys,
      duration: get(this, 'duration'),
      layer: 'backstage.pause'
    };

    get(this, 'stageManager').handleDirectable(null, 'pause', properties, resolve);
  }
});
