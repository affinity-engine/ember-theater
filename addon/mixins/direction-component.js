import Ember from 'ember';

const {
  isPresent,
  Mixin,
  on
} = Ember;

export default Mixin.create({
  destroyDirection: on('willDestroyElement', function() {
    if (isPresent(this.attrs.destroyDirection)) {
      this.attrs.destroyDirection();
    }
  })
});
