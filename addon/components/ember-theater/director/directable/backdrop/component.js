import Ember from 'ember';
import DirectableComponentMixin from 'ember-theater/mixins/ember-theater/director/directable-component';
import VelocityLineMixin from 'ember-theater/mixins/ember-theater/director/velocity-line';
import configurable from 'ember-theater/macros/ember-theater/configurable';

const {
  Component,
  computed,
  get
} = Ember;

const { alias } = computed;
const { inject: { service } } = Ember;
const { Handlebars: { SafeString } } = Ember;

const configurablePriority = ['directable.options', 'backdrop.backdrop', 'backdrop', 'config.attrs.director.backdrop', 'config.attrs.globals'];

export default Component.extend(DirectableComponentMixin, VelocityLineMixin, {
  attributeBindings: ['caption:alt', 'style'],
  classNames: ['et-backdrop'],
  tagName: 'img',

  translator: service('ember-theater/translator'),

  backdrop: alias('directable.backdrop'),
  src: configurable(configurablePriority, 'src'),

  caption: computed('backdrop.caption', 'backdrop.id', 'directable.options.caption', {
    get() {
      const optional = get(this, 'directable.options.caption');
      const fallback = optional || get(this, 'backdrop.caption');
      const translation = optional || `backdrops.${get(this, 'backdrop.id')}`;

      return get(this, 'translator').translate(fallback, translation);
    }
  }).readOnly(),

  style: computed('src', {
    get() {
      return new SafeString(`background-image: url(${get(this, 'src')});`);
    }
  }).readOnly()
});
