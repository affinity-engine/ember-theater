import Ember from 'ember';

const {
  Mixin,
  get,
  observer,
  on
} = Ember;

export default Mixin.create({
  perform: on('didInsertElement', observer('transitions.lastObject.effect', function() {
    // create a clone of the transitions before clearing them
    const transitions = get(this, 'transitions').slice(0);

    get(this, 'transitions').clear();

    this.executeTransitions(transitions).then(() => {
      this.resolve();
    });
  }))
});
