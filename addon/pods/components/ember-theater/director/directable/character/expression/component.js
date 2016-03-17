import Ember from 'ember';
import DirectableComponentMixin from 'ember-theater/mixins/ember-theater/director/directable-component';
import TransitionMixin from 'ember-theater/mixins/ember-theater/director/transition';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import configurable, { deepConfigurable } from 'ember-theater/macros/ember-theater/configurable';

const {
  Component,
  computed,
  get,
  observer,
  on
} = Ember;

const { inject: { service } } = Ember;
const { run: { next } } = Ember;

const configurablePriority = [
  'directable.attrs',
  'expression.expression',
  'expression',
  'config.attrs.director.expression',
  'config.attrs.globals'
];

export default Component.extend(DirectableComponentMixin, TransitionMixin, {
  classNames: ['et-character-expression-container'],
  hook: 'expression-direction',

  translator: service('ember-theater/translator'),

  config: multitonService('ember-theater/config', 'theaterId'),
  preloader: multitonService('ember-theater/preloader', 'theaterId'),

  caption: configurable(configurablePriority, 'caption'),
  resolve: configurable(configurablePriority, 'resolve'),
  src: configurable(configurablePriority, 'src'),
  transitionIn: deepConfigurable(configurablePriority, 'transitionIn'),
  transitionOut: deepConfigurable(configurablePriority, 'transitionOut'),

  captionTranslation: computed('expression.id', 'caption', {
    get() {
      const translation = get(this, 'caption') || `expressions.${get(this, 'expression.id')}`;

      return get(this, 'translator').translate(translation);
    }
  }),

  transitionInExpression: on('didInsertElement', function() {
    this.executeTransitionIn().then(() => {
      get(this, 'resolve')();
    });
  }),

  insertImage: on('didInsertElement', function() {
    next(() => {
      const preloader = get(this, 'preloader');
      const fixture = get(this, 'expression');
      const captionTranslation = get(this, 'captionTranslation');
      const id = get(fixture, '_imageId');
      const image = preloader.getElement(id) || `<img src="${get(this, 'src')}">`;
      const $image = this.$(image).clone();

      $image.addClass('et-character-expression');
      $image.attr('alt', captionTranslation);

      this.$().append($image);
    });
  }),

  changeCaption: observer('captionTranslation', function() {
    const caption = get(this, 'captionTranslation');

    this.$('img').attr('alt', caption);
  })
});
