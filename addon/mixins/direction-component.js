import Ember from 'ember';

const {
  isPresent,
  Mixin,
  on
} = Ember;

export default Mixin.create({
  destroyDirectable: on('willDestroyElement', function() {
    if (isPresent(this.attrs.destroyDirectable)) {
      this.attrs.destroyDirectable();
    }
  })
});
