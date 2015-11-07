import Ember from 'ember';
import DirectionComponentMixin from 'ember-theater/mixins/direction-component';
import VelocityLineMixin from 'ember-theater/mixins/velocity-line';

const { 
  Component, 
  computed, 
  inject,
  observer,
  on 
} = Ember;

export default Component.extend(DirectionComponentMixin, VelocityLineMixin, {
  attributeBindings: ['caption:alt', 'style'],
  classNames: ['et-backdrop'],
  intlWrapper: inject.service(),
  store: inject.service(),
  tagName: 'img',

  caption: computed('backdrop.caption', {
    get() {
      return this.get('intlWrapper').tryIntl(
        this.get('backdrop.caption'),
        `backdrops.${this.get('backdrop.id')}`
      );
    }
  }).readOnly(),

  style: computed('backdrop.src', {
    get() {
      return `background-image: url(${this.get('backdrop.src')});`;
    }
  }).readOnly(),

  setBackdrop: on('didInitAttrs', function() {
    const line = this.get('line');
    const backdrop = this.get('store').peekRecord('ember-theater-backdrop', line.id);

    this.set('backdrop', backdrop);
  }),

  animateBackdrop: on('didInsertElement', observer('line', function() {
    this.executeLine();
  }))
});
