import Ember from 'ember';
import layout from './template';
import configurable from 'ember-theater/macros/ember-theater/configurable';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

import {
  keyUp,
  EKMixin
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

const configurablePriority = ['config.attrs.menuBar', 'config.attrs.globals'];

export default Component.extend(EKMixin, {
  layout,

  keyboardFirstResponder: true,

  config: multitonService('ember-theater/config', 'theaterId'),
  saveStateManager: multitonService('ember-theater/save-state-manager', 'theaterId'),
  sceneManager: multitonService('ember-theater/director/scene-manager', 'theaterId'),

  cancelKeys: configurable(configurablePriority, 'keys.cancel'),
  menuBarClassNames: configurable(configurablePriority, 'classNames'),

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
          classNames
        }
      });

      set(this, 'directable', directable);
    }).then((choice) => this.resolve(choice));
  }
});
