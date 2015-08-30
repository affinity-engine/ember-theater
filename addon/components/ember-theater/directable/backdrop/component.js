import Ember from 'ember';
import DirectableComponentMixin from 'ember-theater/mixins/directable-component';
import VelocityLineMixin from 'ember-theater/mixins/velocity-line';

const { 
  Component, 
  computed, 
  inject,
  on 
} = Ember;
const { alias } = computed;

export default Component.extend(DirectableComponentMixin, VelocityLineMixin, {
  attributeBindings: ['caption:alt'],
  classNames: ['et-backdrop'],
  intlWrapper: inject.service(),
  store: inject.service(),
  tagName: 'img',

  caption: computed('backdrop.caption', 'backdrop.intl', {
    get() {
      if (this.get('backdrop.intl')) {
        return this.get('intlWrapper').formatMessage(`backdrops.${this.get('backdrop.id')}`);
      } else {
        return this.get('backdrop.caption');
      }
    }
  }),

  setBackdrop: on('didInitAttrs', function() {
    const line = this.get('line');
    const backdrop = this.get('store').peekRecord('ember-theater-backdrop', line.id);

    this.set('backdrop', backdrop);
  }),

  setImagePath: on('didRender', function() {
    const element = this.$();

    if (element) {
      element.css('background-image',`url(${this.get('backdrop.src')})`);
    }

    this.executeLine();
  })
});
