import Ember from 'ember';
import layout from './template';

const { Component, RSVP, inject, observer, on, run } = Ember;
const { Promise } = RSVP;

export default Component.extend({
  store: inject.service(),
  lineReader: inject.service(),
  layout: layout,
  classNames: ['ember-theater__director'],
  sceneObjects: Ember.A([]),

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

  addSceneObject(line, sceneObject) {
    const sceneObjects = this.get('sceneObjects');
    sceneObject.set('line', line);

    if (line.destroy) { sceneObjects.removeObject(sceneObject); return line.resolve(); }
    if (!sceneObjects.isAny('id', line.id)) { sceneObjects.pushObject(sceneObject); }
  },

  actions: {
    backdrop(line) {
      const sceneObject = this.get('store').peekRecord('ember-theater-backdrop', line.id);
      this.addSceneObject(line, sceneObject);
   },

    character(line) {
      const sceneObject = this.get('store').peekRecord('ember-theater-character', line.id);
      this.addSceneObject(line, sceneObject);
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
