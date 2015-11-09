import Ember from 'ember';
import DirectableComponentMixin from 'ember-theater/mixins/directable-component';
import VelocityLineMixin from 'ember-theater/mixins/velocity-line';
import animate from 'ember-theater/utils/animate';

const {
  Component,
  computed,
  get,
  inject,
  merge,
  observer,
  on
} = Ember;

const { alias } = computed;

export default Component.extend(DirectableComponentMixin, VelocityLineMixin, {
  attributeBindings: ['caption:alt', 'src'],
  classNames: ['et-character-expression'],
  tagName: 'img',

  emberTheaterTranslate: inject.service(),

  src: alias('expression.src'),

  caption: computed('expression.caption', {
    get() {
      const fallback = get(this, 'expression.caption');
      const translation = `expressions.${this.get('expression.id')}`;

      return get(this, 'emberTheaterTranslate').translate(fallback, translation);
    }
  })
});
