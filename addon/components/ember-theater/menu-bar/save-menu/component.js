import Ember from 'ember';
import layout from './template';

const {
  Component,
  computed,
  inject
} = Ember;
const { alias } = computed;

export default Component.extend({
  layout: layout,
  saves: alias('session.saves'),
  session: inject.service()
});
