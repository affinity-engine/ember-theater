import Ember from 'ember';
import DirectableComponentMixin from 'ember-theater/mixins/ember-theater/director/directable-component';
import TransitionMixin from 'ember-theater/mixins/ember-theater/director/transition';
import TransitionObserverMixin from 'ember-theater/mixins/ember-theater/director/transition-observer';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import configurable, { deepConfigurable, deepArrayConfigurable } from 'ember-theater/macros/ember-theater/configurable';

const {
  Component,
  computed,
  get,
  observer,
  on
} = Ember;

const { inject: { service } } = Ember;
const { Handlebars: { SafeString } } = Ember;
const { run: { next } } = Ember;

const configurablePriority = [
  'directable.attrs',
  'directable.attrs.fixture',
  'config.attrs.director.backdrop',
  'config.attrs.globals'
];

export default Component.extend(DirectableComponentMixin, TransitionMixin, TransitionObserverMixin, {
  classNames: ['et-backdrop-container'],
  hook: 'backdrop-direction',

  translator: service('ember-theater/translator'),

  config: multitonService('ember-theater/config', 'theaterId'),
  preloader: multitonService('ember-theater/preloader', 'theaterId'),

  caption: configurable(configurablePriority, 'caption'),
  src: configurable(configurablePriority, 'src'),
  transitions: deepArrayConfigurable(configurablePriority, 'directable.attrs.transitions', 'transition'),

  captionTranslation: computed('directable.attrs.fixture.id', 'caption', {
    get() {
      const translation = get(this, 'caption') || `backdrops.${get(this, 'directable.attrs.fixture.id')}`;

      return get(this, 'translator').translate(translation);
    }
  }).readOnly(),

  insertImage: on('didInsertElement', function() {
    next(() => {
      const preloader = get(this, 'preloader');
      const fixture = get(this, 'directable.attrs.fixture');
      const captionTranslation = get(this, 'captionTranslation');
      const id = get(fixture, '_imageId');
      const image = preloader.getElement(id) || `<img src="${get(this, 'src')}">`;
      const $image = this.$(image).clone();

      $image.addClass('et-backdrop');
      $image.attr('alt', captionTranslation);

      this.$().append($image);  
    });
  }),

  changeCaption: observer('captionTranslation', function() {
    const caption = get(this, 'captionTranslation');

    this.$('img').attr('alt', caption);
  })
});
