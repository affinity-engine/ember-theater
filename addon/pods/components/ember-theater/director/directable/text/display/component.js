import Ember from 'ember';
import layout from './template';

const {
  Component,
  computed,
  get,
  on
} = Ember;

const { inject: { service } } = Ember;

export default Ember.Component.extend({
  layout,

  classNames: ['et-text'],
  classNameBindings: ['decorativeClassNames', 'structuralClassNames', 'scrollable:et-scrollable'],

  translator: service('ember-theater/translator'),

  initializePerfectScrollbar: on('didRender', function() {
    if (get(this, 'scrollable')) {
      PerfectScrollbar.initialize(this.$().find('.et-text-body-container')[0], {
        suppressScrollX: true
      });
    }
  }),

  nameTranslation: computed('name', {
    get() {
      return get(this, 'translator').translate(get(this, 'name'));
    }
  }).readOnly(),

  textTranslation: computed('text', {
    get() {
      const text = get(this, 'text');

      return get(this, 'translator').translate(text);
    }
  }).readOnly()
});
