import Ember from 'ember';
import layout from '../templates/components/ember-theater-director';

const { Component, RSVP, inject, observer, on, run } = Ember;
const { Promise } = RSVP;

export default Component.extend({
  store: inject.service(),
  lineReader: inject.service(),
  layout: layout,
  classNames: ['ember-theater__director'],
  backdrops: Ember.A([]),
  characters: Ember.A([]),

  loadScene: observer('scene', function() {
    this.get('lineReader').set('scene', this.get('scene'));
    this.send('next');
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
      const backdrops = this.get('backdrops');
      const backdrop = this.get('store').peekRecord('ember-theater-backdrop', line.id);
      backdrop.set('line', line);
      if (line.destroy) { backdrops.removeObject(backdrop); return line.resolve(); }
      if (!backdrops.isAny('id', line.id)) { backdrops.pushObject(backdrop); }
    },

    character(line) {
      const characters = this.get('characters');
      const character = this.get('store').peekRecord('ember-theater-character', line.id);
      character.set('line', line);
      if (line.destroy) { characters.removeObject(character); return line.resolve(); }
      if (!characters.isAny('id', line.id)) { characters.pushObject(character); }
    },

    next() {
      const { action, line } = this.get('lineReader').nextLine();
      if (!action) { return; }

      const promise = new Promise((resolve) => {
        line.resolve = resolve;
        this.send(action, line);
      });

      promise.then(() => {
        this.send('next');
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
