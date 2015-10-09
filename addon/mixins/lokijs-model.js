import DS from 'ember-data';
import Ember from 'ember';

const { attr } = DS;
const { Mixin } = Ember;

export default Mixin.create({
  meta: attr()
});
