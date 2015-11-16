import Ember from 'ember';
import DirectableComponentMixin from 'ember-theater/mixins/directable-component';
import VelocityLineMixin from 'ember-theater/mixins/velocity-line';

const {
  Component,
  computed,
  get,
  observer,
  on,
  set
} = Ember;

const { alias } = computed;
const { inject: { service } } = Ember;

export default Component.extend(DirectableComponentMixin, VelocityLineMixin, {
  attributeBindings: ['caption:alt', 'style'],
  classNames: ['et-backdrop'],
  tagName: 'img',

  translator: service('ember-theater/translator'),

  backdrop: alias('directable.backdrop'),

  caption: computed('backdrop.caption', 'backdrop.id', {
    get() {
      const fallback = get(this, 'backdrop.caption');
      const translation = `backdrops.${get(this, 'backdrop.id')}`;

      return get(this, 'translator').translate(fallback, translation);
    }
  }).readOnly(),

  style: computed('backdrop.src', {
    get() {
      return `background-image: url(${get(this, 'backdrop.src')});`;
    }
  }).readOnly()
});
