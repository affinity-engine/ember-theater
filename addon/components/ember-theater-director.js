import Ember from 'ember';
import layout from '../templates/components/ember-theater-director';

const { Component, $, inject, observer, on, run } = Ember;

export default Component.extend({
  store: inject.service('store'),
  layout: layout,
  classNames: ['ember-theater__director'],
  backdrops: Ember.A([]),
  characters: Ember.A([]),

  _loadScene: observer('scene.script', function() {
    const scene = this.get('scene');
    scene.set('director', this);
    scene.send('next');
  }),

  // `keyPress` is not recognized on this component, so we need to set it up manually on the body.
  resolveKeyPress(event) {
    if (event.which === 32 && this.get('pauseKeyPress')) {
      this.get('pauseKeyPress')();
    }
  },
  
  setupKeyPressObserver: on('didInsertElement', function() {
    Ember.$('body').on('keypress', (event) => {
      this.resolveKeyPress(event);
    });
  }),

  actions: {
    backdrop(line) {
      if (!line.sync) { line.resolve(); }
      const backdrop = this.get('store').peekRecord('ember-theater-backdrop', line.id);
      const backdrops = this.get('backdrops');
      if (line.destroy) { return backdrops.removeObject(backdrop); }
      backdrops.pushObject(backdrop);

      run.next(() => {
        const element = backdrop.get('component.element');
        const effect = line.effect ? line.effect : 'transition.fadeIn';
        $.Velocity.animate(element, effect, line.options).then(() => {
          if (line.sync) { line.resolve(); }
        });
      });
    },

    character(line) {
      if (!line.sync) { line.resolve(); }
      const character = this.get('store').peekRecord('ember-theater-character', line.id);
      const characters = this.get('characters');
      if (line.destroy) { return characters.removeObject(character); }
      characters.pushObject(character);

      run.next(() => {
        const element = character.get('component.element');
        const effect = line.effect ? line.effect : 'transition.fadeIn';
        $.Velocity.animate(element, effect, line.options).then(() => {
          if (line.sync) { line.resolve(); }
        });
      });
    },

    pause(line) {
      if (line.keyPress) {
        this.set('pauseKeyPress', line.resolve);
      }
      if (line.duration) {
      run.later(() => {
        line.resolve();
        this.set('pauseKeyPress', null);
      }, line.duration);
      }
    }
  }
});
