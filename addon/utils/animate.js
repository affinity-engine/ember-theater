import Ember from 'ember';

export default function animate(element, effect, options) {
  return Ember.$.Velocity.animate(element, effect, options);
}
