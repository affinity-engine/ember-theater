import Ember from 'ember';

const {
  Mixin,
  get,
  observer,
  on
} = Ember;

export default Mixin.create({
  performTransitions: on('didInsertElement', observer('transitions.[]', function() {
    if (get(this, 'transitions.length') > 0) {
      // create a clone of the transitions before clearing them
      const transitions = get(this, 'transitions').slice(0);

      get(this, 'directable.attrs.transitions').clear();

      this.executeTransitions(transitions).then(() => {
        this.resolve(get(this, 'directable.direction'));
      });
    }
  })),

  stop(queue) {
    this.$().velocity('stop', queue);
  }
});
