import Ember from 'ember';
import layout from './template';
import configurable from 'ember-theater/macros/ember-theater/configurable';
import multiService from 'ember-theater/macros/ember-theater/multi-service';

import {
  keyUp,
  EKMixin,
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

const configurablePriority = ['config.menuBar', 'config.globals'];

export default Component.extend(EKMixin, EKOnInsertMixin, {
  layout,
  keyboardFirstResponder: true,

  configs: service('ember-theater/config'),
  saveStateManagers: service('ember-theater/save-state-manager'),
  sceneManagers: service('ember-theater/director/scene-manager'),

  config: multiService('configs'),
  saveStateManager: multiService('saveStateManagers'),
  sceneManager: multiService('sceneManagers'),

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
