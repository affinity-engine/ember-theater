import Ember from 'ember';

const {
  Mixin,
  get,
  observer,
  on
} = Ember;

export default Mixin.create({
  perform: on('didInsertElement', observer('transition.effect', function() {
    const transition = get(this, 'transition');

    this.executeTransition(transition).then(() => {
      this.resolve();
    });
  }))
});
