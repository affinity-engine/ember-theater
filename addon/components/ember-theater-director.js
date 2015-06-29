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
    backdrop(line, resolve) {
      if (!line.sync) { resolve(); }
      const backdrop = this.get('store').peekRecord('ember-theater-backdrop', line.id);
      const backdrops = this.get('backdrops');
      if (line.destroy) { return backdrops.removeObject(backdrop); }
      const backdropIsPresent = backdrops.some((b) => {
        return b.id === backdrop.id;
      });

      if (!backdropIsPresent) {
        backdrops.pushObject(backdrop);
      }

      run.next(() => {
        const element = backdrop.get('component.element');
        const effect = line.effect ? line.effect : 'transition.fadeIn';
        $.Velocity.animate(element, effect, line.options).then(() => {
          if (line.sync) { resolve(); }
        });
      });
    },

    character(line, resolve) {
      if (!line.sync) { resolve(); }
      const character = this.get('store').peekRecord('ember-theater-character', line.id);
      const characters = this.get('characters');
      
      const characterIsPresent = characters.some((x) => {
        return x.id === character.id;
      });

      if (!characterIsPresent) {
        characters.pushObject(character);
      }

      run.later(() => {
        const element = character.get('component.element');
        const effect = line.effect;
        const centered = `${50 - (character.get('component.characterWidthPercentage') / 2)}vw`;
        if (effect.position === 'center') {
          effect.translateX = centered;
        } else if (typeof effect.position === 'object') {
          effect.translateX = effect.position.map((position) => {
            return position === 'center' ? centered : position;
          });
        }
        $.Velocity.animate(element, effect, line.options).then(() => {
          if (line.sync) { resolve(); }
        });
      }, 500);
    },

    pause(line, resolve) {
      if (line.keyPress) {
        this.set('pauseKeyPress', resolve);
      }
      if (line.duration) {
      run.later(() => {
        resolve();
        this.set('pauseKeyPress', null);
      }, line.duration);
      }
    }
  }
});
