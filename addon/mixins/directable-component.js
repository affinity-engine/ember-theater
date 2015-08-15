import Ember from 'ember';

const {
  Mixin,
  on
} = Ember;

export default Mixin.create({
  destroyDirectable: on('willDestroyElement', function() {
    this.attrs.destroyDirectable();
  })
});
