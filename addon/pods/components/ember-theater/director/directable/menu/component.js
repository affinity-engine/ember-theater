import Ember from 'ember';
import layout from './template';
import DirectableComponentMixin from 'ember-theater/mixins/ember-theater/director/directable-component';
import TransitionMixin from 'ember-theater/mixins/ember-theater/director/transition';
import configurable, { deepConfigurable } from 'ember-theater/macros/ember-theater/configurable';
import multiton from 'ember-multiton-service';

const {
  Component,
  computed,
  get,
  getProperties,
  isPresent,
  on,
  set,
  typeOf
} = Ember;

const { inject: { service } } = Ember;
const { run: { next } } = Ember;

const mixins = [
  DirectableComponentMixin,
  TransitionMixin
];

const configurablePriority = [
  'directable.attrs',
  'config.attrs.director.menu',
  'config.attrs.director',
  'config.attrs.globals'
];

export default Component.extend(...mixins, {
  layout,

  config: multiton('ember-theater/config', 'theaterId'),

  menuUI: configurable(configurablePriority, 'menuUI'),

  transitionIn: deepConfigurable(configurablePriority, 'transitionIn', 'transition'),
  transitionOut: deepConfigurable(configurablePriority, 'transitionOut'),

  transitionInMenu: on('didInsertElement', function() {
    this.executeTransitionIn();
  }),

  actions: {
    choose(choice) {
      set(this, 'directable.direction.result', choice);

      this.$().parents('.ember-theater').trigger('focus');

      this.executeTransitionOut().then(() => {
        this.resolveAndDestroy();
      });
    }
  }
});
