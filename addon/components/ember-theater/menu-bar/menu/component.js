import Ember from 'ember';
import layout from './template';
import configurable from 'ember-theater/macros/ember-theater/director/configurable';

import {
  keyUp,
  EKOnInsertMixin
} from 'ember-keyboard';

const {
  Component,
  computed,
  get,
  getProperties,
  on,
  set
} = Ember;

const { RSVP: { Promise } } = Ember;
const { inject: { service } } = Ember;

export default Component.extend(EKOnInsertMixin, {
  layout,
  keyboardPriority: 10000,

  config: service('ember-theater/config'),
  saveStateManager: service('ember-theater/save-state-manager'),
  sceneManager: service('ember-theater/director/scene-manager'),
  cancelKeys: configurable('menuBar', 'keys.cancel'),
  menuBarClassNames: configurable('menuBar', 'classNames'),

  setupCancelKeys: on('init', function() {
    const cancelKeys = get(this, 'cancelKeys');

    cancelKeys.forEach((key) => this.on(keyUp(key), () => this.attrs.closeMenu()));
  }),

  initializeChoiceMenu: on('init', async function() {
    await this.populateChoices();
    this.renderDirectable();
  }),

  choices: computed({
    get() {
      return Ember.A([{
        class: 'et-choice-close',
        icon: 'arrow-right',
        text: 'ember-theater.menu.cancel'
      }]);
    }
  }),

  renderDirectable() {
    const classNames = get(this, 'menuClassNames') || get(this, 'menuBarClassNames');
    const keyboardPriority = 1000000;
    const {
      choices,
      header
    } = getProperties(this, 'choices', 'header');

    new Promise((resolve) => {
      const directable = Ember.Object.create({
        choices,
        header,
        resolve,
        options: {
          classNames,
          keyboardPriority
        }
      });

      set(this, 'directable', directable);
    }).then((choice) => this.resolve(choice));
  }
});
