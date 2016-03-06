import Ember from 'ember';

const {
  Mixin,
  get,
  observer,
  on,
  set
} = Ember;

export default Mixin.create({
  performTransitions: on('didInsertElement', observer('transitions.lastObject.effect', function() {
    // create a clone of the transitions before clearing them
    const transitions = get(this, 'transitions').slice(0);

    get(this, 'transitions').clear();

    this.executeTransitions(transitions).then(() => {
      this.resolve(get(this, 'directable.direction'));
    });
  })),

  stop(queue) {
    this.$().velocity('stop', queue);
  }
});
