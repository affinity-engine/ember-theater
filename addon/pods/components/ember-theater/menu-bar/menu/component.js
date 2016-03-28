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

  keyboardPriority: 999999999,

  config: multitonService('ember-theater/config', 'theaterId'),
  saveStateManager: multitonService('ember-theater/save-state-manager', 'theaterId'),

  cancelKeys: configurable(configurablePriority, 'keys.cancel'),
  menuBarClassNames: configurable(configurablePriority, 'classNames'),

  setupCancelKeys: on('init', function() {
    const cancelKeys = get(this, 'cancelKeys');

    cancelKeys.forEach((key) => this.on(keyUp(key), () => this.attrs.closeMenu()));
  }),

  initializeMenuMenu: on('init', async function() {
    await this.populateChoices();
    this.renderDirectable();
  }),

  choices: computed({
    get() {
      return Ember.A([{
        class: 'et-menu-close',
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
        resolve,
        direction: {},
        attrs: {
          choices,
          classNames,
          header
        }
      });

      set(this, 'directable', directable);
    }).then((menu) => this.resolve(menu.result));
  }
});
