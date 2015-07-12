import Ember from 'ember';

const { 
  computed, 
  Mixin 
} = Ember;

export default Mixin.create({
  _modulePrefix: computed({
    get() {
      return this.container.lookupFactory('config:environment').modulePrefix;
    }
  })
});
