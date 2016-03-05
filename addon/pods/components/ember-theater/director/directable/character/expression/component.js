import Ember from 'ember';
import DirectableComponentMixin from 'ember-theater/mixins/ember-theater/director/directable-component';
import TransitionMixin from 'ember-theater/mixins/ember-theater/director/transition';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import configurable, { deepConfigurable } from 'ember-theater/macros/ember-theater/configurable';
import { HookMixin } from 'ember-hook';

const {
  Component,
  computed,
  get,
  on
} = Ember;

const { inject: { service } } = Ember;

const configurablePriority = [
  'directable.attrs',
  'expression.expression',
  'expression',
  'config.attrs.director.expression',
  'config.attrs.globals'
];

export default Component.extend(DirectableComponentMixin, HookMixin, TransitionMixin, {
  attributeBindings: ['captionTranslation:alt', 'src'],
  classNames: ['et-character-expression'],
  hook: 'expression-direction',
  tagName: 'img',

  translator: service('ember-theater/translator'),

  config: multitonService('ember-theater/config', 'theaterId'),

  caption: configurable(configurablePriority, 'caption'),
  resolve: configurable(configurablePriority, 'resolve'),
  src: configurable(configurablePriority, 'src'),
  transitionIn: deepConfigurable(configurablePriority, 'transitionIn'),
  transitionOut: deepConfigurable(configurablePriority, 'transitionOut'),

  captionTranslation: computed('expression.id', 'caption', {
    get() {
      const translation = get(this, 'caption') || `expressions.${get(this, 'expression.id')}`;

      return get(this, 'translator').translate(translation);
    }
  }),

  transitionInExpression: on('didInsertElement', function() {
    this.executeTransitionIn().then(() => {
      get(this, 'resolve')();
    });
  })
});
