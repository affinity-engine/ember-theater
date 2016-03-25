import Ember from 'ember';

const {
  Mixin,
  get,
  observer,
  on,
  set
} = Ember;

const { run: { debouce } } = Ember;

export default Mixin.create({
  performTransitions: on('didInsertElement', observer('transitions.lastObject.effect', function() {
    debounce(this, this._performTransitions, 10);
  })),

  _performTransitions() {
    // create a clone of the transitions before clearing them
    const transitions = get(this, 'transitions').slice(0);

    get(this, 'directable.attrs.transitions').clear();

    this.executeTransitions(transitions).then(() => {
      this.resolve(get(this, 'directable.direction'));
    });
  },

  stop(queue) {
    this.$().velocity('stop', queue);
  }
});
