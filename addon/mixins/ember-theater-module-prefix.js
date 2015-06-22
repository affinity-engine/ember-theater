import Ember from 'ember';

const { Mixin, computed } = Ember;

export default Mixin.create({
  _modulePrefix: computed({
    get() {
      return this.container.lookupFactory('config:environment').modulePrefix;
    }
  })
});
