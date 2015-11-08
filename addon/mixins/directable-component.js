import Ember from 'ember';

const {
  get,
  isPresent,
  Mixin,
  on,
  set
} = Ember;
const { computed: { alias } } = Ember;

export default Mixin.create({
  autoResolve: alias('directable.autoResolve'),
  autoResolveResult: alias('directable.autoResolveResult'),

  associateDirectable: on('didInitAttrs', function() {
    const directable = get(this, 'directable');

    set(directable, 'component', this);
  }),
  
  destroyDirectable: on('willDestroyElement', function() {
    if (isPresent(this.attrs.destroyDirectable)) {
      this.attrs.destroyDirectable();
    }
  })
});
