import Ember from 'ember';
import layout from './template';

const {
  Component,
  computed,
  get,
  on
} = Ember;

const { Handlebars: { SafeString } } = Ember;
const { inject: { service } } = Ember;

export default Component.extend({
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

  nameStyle: computed('namePosition', 'namePositions.[]', {
    get() {
      const namePosition = get(this, 'namePosition');
      const styleObject = get(this, `namePositions.${namePosition}`);
      const styleString = Object.keys(styleObject).map((key) => `${key}: ${get(styleObject, key)};`).join(' ');

      return new SafeString(styleString);
    }
  }).readOnly(),

  textTranslation: computed('text', {
    get() {
      const text = get(this, 'text');

      return get(this, 'translator').translate(text);
    }
  }).readOnly()
});
