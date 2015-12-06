import Ember from 'ember';
import DirectableComponentMixin from 'ember-theater/mixins/ember-theater/director/directable-component';
import VelocityLineMixin from 'ember-theater/mixins/ember-theater/director/velocity-line';

const {
  Component,
  computed,
  get
} = Ember;

const { alias } = computed;
const { inject: { service } } = Ember;
const { Handlebars: { SafeString } } = Ember;

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
      return new SafeString(`background-image: url(${get(this, 'backdrop.src')});`);
    }
  }).readOnly()
});
