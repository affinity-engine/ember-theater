import Ember from 'ember';
import DirectableComponentMixin from 'ember-theater/mixins/ember-theater/director/directable-component';
import VelocityLineMixin from 'ember-theater/mixins/ember-theater/director/velocity-line';
import configurable, { deepConfigurable } from 'ember-theater/macros/ember-theater/configurable';

const {
  Component,
  computed,
  get
} = Ember;

const { inject: { service } } = Ember;

const configurablePriority = [
  'directable.attrs',
  'expression.expression',
  'expression',
  'config.attrs.director.expression',
  'config.attrs.globals'
];

export default Component.extend(DirectableComponentMixin, VelocityLineMixin, {
  attributeBindings: ['captionTranslation:alt', 'src'],
  classNames: ['et-character-expression'],
  tagName: 'img',

  translator: service('ember-theater/translator'),

  caption: configurable(configurablePriority, 'caption'),
  src: configurable(configurablePriority, 'src'),
  transition: deepConfigurable(configurablePriority, 'transition'),

  captionTranslation: computed('expression.id', 'caption', {
    get() {
      const translation = get(this, 'caption') || `expressions.${get(this, 'expression.id')}`;

      return get(this, 'translator').translate(translation);
    }
  })
});
