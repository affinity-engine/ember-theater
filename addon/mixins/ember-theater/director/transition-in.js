import Ember from 'ember';
import animate from 'ember-theater/utils/ember-theater/animate';

const {
  Mixin,
  get,
  getProperties,
  merge,
  on
} = Ember;

export default Mixin.create({
  executeTransitionIn: on('didInsertElement', function() {
    const transition = get(this, 'transitionIn');
    const effect = get(transition, 'effect');
    const options = getProperties(transition, ...Object.keys(transition));

    animate(this.element, effect, options);
  }),

  executeTransitionOut() {
    const transition = get(this, 'transitionOut');
    const effect = get(transition, 'effect');
    const options = getProperties(transition, ...Object.keys(transition));

    if (get(this, 'autoResolve')) {
      merge(options, { duration: 0 });
    }

    return animate(this.element, effect, options);
  }
});
