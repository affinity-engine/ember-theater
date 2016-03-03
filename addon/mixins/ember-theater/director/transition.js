import Ember from 'ember';
import animate from 'ember-theater/utils/ember-theater/animate';

const {
  Mixin,
  K,
  get,
  getProperties,
  merge
} = Ember;

export default Mixin.create({
  executeTransitionIn() {
    const transition = get(this, 'transitionIn');

    return this.executeTransition(transition);
  },

  executeTransitionOut() {
    const transition = get(this, 'transitionOut');

    return this.executeTransition(transition);
  },

  executeTransitions(transitions) {
    transitions.map((transition, index) => {
      return this.executeTransition(transition);
    });

    return Ember.RSVP.map(transitions, K);
  },

  executeTransition(transition) {
    const effect = get(transition, 'effect');
    const options = getProperties(transition, ...Object.keys(transition));

    if (get(this, 'autoResolve')) {
      merge(options, { duration: 0 });
    }

    return animate(this.element, effect, options);
  }
});
