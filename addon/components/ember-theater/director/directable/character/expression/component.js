import Ember from 'ember';
import DirectableComponentMixin from 'ember-theater/mixins/ember-theater/director/directable-component';
import VelocityLineMixin from 'ember-theater/mixins/ember-theater/director/velocity-line';
import configurable from 'ember-theater/macros/ember-theater/configurable';

const {
  Component,
  computed,
  get
} = Ember;

const { inject: { service } } = Ember;

const configurablePriority = ['directable.options', 'expression.expression', 'expression', 'config.director.expression', 'config.globals'];

export default Component.extend(DirectableComponentMixin, VelocityLineMixin, {
  attributeBindings: ['caption:alt', 'src'],
  classNames: ['et-character-expression'],
  tagName: 'img',

  translator: service('ember-theater/translator'),

  src: configurable(configurablePriority, 'src'),

  caption: computed('expression.caption', 'expression.id', 'directable.options.caption', {
    get() {
      const optional = get(this, 'directable.options.caption');
      const fallback = optional || get(this, 'expression.caption');
      const translation = optional || `expressions.${get(this, 'expression.id')}`;

      return get(this, 'translator').translate(fallback, translation);
    }
  })
});
