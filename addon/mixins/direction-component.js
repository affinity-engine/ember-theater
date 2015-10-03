import Ember from 'ember';

const {
  Mixin,
  on
} = Ember;

export default Mixin.create({
  destroyDirection: on('willDestroyElement', function() {
    this.attrs.destroyDirection();
  })
});
