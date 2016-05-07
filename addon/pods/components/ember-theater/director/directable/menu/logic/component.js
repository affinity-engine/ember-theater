import Ember from 'ember';
import layout from './template';
import configurable, { deepConfigurable } from 'ember-theater/macros/ember-theater/configurable';
import multiton from 'ember-multiton-service';

const {
  Component,
  computed,
  get,
  getProperties,
  isPresent,
  on,
  set,
  typeOf
} = Ember;

const { inject: { service } } = Ember;
const { run: { next } } = Ember;

const configurablePriority = [
  'directable.attrs',
  'config.attrs.director.menu',
  'config.attrs.director',
  'config.attrs.globals'
];

export default Component.extend({
  layout,

  tagName: null,

  config: multiton('ember-theater/config', 'theaterId'),
  translator: service('ember-theater/translator'),

  choices: configurable(configurablePriority, 'choices'),
  header: configurable(configurablePriority, 'header'),

  handlePriorSceneRecord: on('didInsertElement', function() {
    if (isPresent(get(this, 'priorSceneRecord'))) {
      const choice = get(this, 'priorSceneRecord');

      this.send('choose', choice);
    }
  }),

  translatedChoices: computed('choices.[]', {
    get() {
      const choices = get(this, 'choices');

      return choices.map((value, index) => {
        const key = get(value, 'key') || index;
        const text = get(this, 'translator').translate(value);

        return Ember.Object.create({
          ...value,
          key,
          text: typeOf(text) === 'string' ? text : ''
        });
      });
    }
  }).readOnly(),

  translatedHeader: computed('header', {
    get() {
      const header = get(this, 'header');

      return get(this, 'translator').translate(header);
    }
  }).readOnly()
});
