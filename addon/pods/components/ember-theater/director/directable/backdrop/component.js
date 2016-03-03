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

const configurablePriority = [
  'directable.attrs',
  'directable.attrs.fixture',
  'config.attrs.director.backdrop',
  'config.attrs.globals'
];

export default Component.extend(DirectableComponentMixin, TransitionMixin, TransitionObserverMixin, {
  attributeBindings: ['captionTranslation:alt', 'style'],
  classNames: ['et-backdrop'],
  tagName: 'img',

  translator: service('ember-theater/translator'),

  config: multitonService('ember-theater/config', 'theaterId'),

  caption: configurable(configurablePriority, 'caption'),
  src: configurable(configurablePriority, 'src'),
  transitions: deepArrayConfigurable(configurablePriority, 'directable.attrs.transitions', 'transition'),

  captionTranslation: computed('fixture.id', 'caption', {
    get() {
      const translation = get(this, 'caption') || `backdrops.${get(this, 'fixture.id')}`;

      return get(this, 'translator').translate(translation);
    }
  }).readOnly(),

  style: computed('src', {
    get() {
      return new SafeString(`background-image: url(${get(this, 'src')});`);
    }
  }).readOnly()
});
