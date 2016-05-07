import Ember from 'ember';
import configurable from 'ember-theater/macros/ember-theater/configurable';
import multiton from 'ember-multiton-service';
import { BusPublisherMixin } from 'ember-message-bus';

import {
  keyDown,
  EKMixin
} from 'ember-keyboard';

const {
  Component,
  K,
  computed,
  get,
  getOwner,
  getProperties,
  isPresent,
  on,
  set
} = Ember;

const { RSVP: { Promise } } = Ember;

const configurablePriority = ['config.attrs.menuBar', 'config.attrs.globals'];

export default Component.extend(BusPublisherMixin, EKMixin, {
  keyboardFirstResponder: true,
  keyboardLaxPriority: true,
  classNames: ['et-menu-bar-control-icon'],
  tagName: 'button',
  windowId: 'main',

  config: multiton('ember-theater/config', 'theaterId'),
  saveStateManager: multiton('ember-theater/save-state-manager', 'theaterId'),
  director: multiton('ember-theater/director/director', 'theaterId', 'windowId'),

  menuBarClassNames: configurable(configurablePriority, 'classNames'),

  setupFocusKeystroke: on('init', function() {
    const type = get(this, 'type');
    const keys = get(this, `config.attrs.menuBar.${type}.keys.open`);

    keys.forEach((key) => this.on(keyDown(key), (event) => {
      this.toggleOpen();
      event.preventDefault();
    }));
  }),

  toggleOpen: on('click', 'touchEnd', function() {
    this.openMenu();
  }),

  startHovering: on('focusIn', 'mouseEnter', function() {
    if (isPresent(this.startHoverEffect)) {
      this.startHoverEffect();
    }
  }),

  stopHovering: on('focusOut', 'mouseLeave', function() {
    if (isPresent(this.stopHoverEffect)) {
      this.stopHoverEffect();
    }
  }),

  openMenu: async function() {
    this.resetChoices();
    await this.populateChoices();
    this.renderDirectable();
  },

  resetChoices() {
    set(this, 'choices', Ember.A([{
      class: 'et-menu-close',
      icon: 'arrow-right',
      text: 'ember-theater.menu.cancel'
    }]));
  },

  scene: async function(script, window) {
    const {
      choices,
      header,
      menuClassNames,
      menuBarClassNames
    } = getProperties(this, 'choices', 'header', 'menuClassNames', 'menuBarClassNames');

    const classNames = menuClassNames || menuBarClassNames;

    const choice = await script.Menu(choices).header(header).classNames(classNames).keyboardPriority(999999999);

    this.resolve(choice);

    this.resetChoices();

    window.close();
  },

  renderDirectable() {
    const { director, theaterId, windowId } = getProperties(this, 'director', 'theaterId', 'windowId');
    const container = getOwner(this);
    const script = container.lookup('script:main').create({ sceneRecord: {}, theaterId, windowId, _record: K });
    const direction = container.lookup('direction:scene');
    const args = (script, window) => {
      this.scene(script, window);
    }

    director.direct(script, direction, [args]).window('_menubar').classNames('et-center-large').priority(1000).transitionIn({ opacity: 1 }, 0);
  }
});
