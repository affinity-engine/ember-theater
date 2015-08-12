import Ember from 'ember';
import VelocityLineMixin from '../../mixins/velocity-line';

const { 
  Component, 
  computed, 
  inject,
  on 
} = Ember;
const { alias } = computed;

export default Component.extend(VelocityLineMixin, {
  alt: alias('backdrop.caption'),
  attributeBindings: ['alt'],
  classNames: ['ember-theater-stage__backdrop'],
  store: inject.service(),
  tagName: 'img',

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
