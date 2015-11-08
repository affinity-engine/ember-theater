import Ember from 'ember';
import DirectableComponentMixin from 'ember-theater/mixins/directable-component';
import VelocityLineMixin from 'ember-theater/mixins/velocity-line';

const { 
  Component, 
  computed, 
  get,
  inject,
  observer,
  on,
  set 
} = Ember;

export default Component.extend(DirectableComponentMixin, VelocityLineMixin, {
  attributeBindings: ['caption:alt', 'style'],
  classNames: ['et-backdrop'],
  tagName: 'img',

  emberTheaterTranslate: inject.service(),
  store: inject.service(),

  caption: computed('backdrop.caption', 'backdrop.id', {
    get() {
      const fallback = get(this, 'backdrop.caption');
      const translation = `backdrops.${get(this, 'backdrop.id')}`;

      return get(this, 'emberTheaterTranslate').translate(fallback, translation);
    }
  }).readOnly(),

  style: computed('backdrop.src', {
    get() {
      return `background-image: url(${get(this, 'backdrop.src')});`;
    }
  }).readOnly(),

  setBackdrop: on('didInitAttrs', function() {
    const id = get(this, 'directable.id');
    const backdrop = get(this, 'store').peekRecord('ember-theater-backdrop', id);

    set(this, 'backdrop', backdrop);
  })
});
