import Ember from 'ember';
import layout from './template';
import ModulePrefixMixin from '../../mixins/ember-theater-module-prefix';

const { Component, RSVP, inject, observer } = Ember;
const { Promise } = RSVP;

export default Component.extend(ModulePrefixMixin, {
  lineReader: inject.service(),
  layout: layout,
  classNames: ['ember-theater__director'],
  sceneObjects: Ember.A([]),

  loadScene: observer('scene', function() {
    this.get('lineReader').set('scene', this.get('scene'));
    this.send('next');
  }),

  actions: {
    perform(action, line) {
      const modulePrefix = this.get('_modulePrefix');
      const dashAction = Ember.String.dasherize(action);
      const direction = require(`${modulePrefix}/ember-theater-directions/${dashAction}`)['default'];
      direction.set('container', this.get('container'));
      direction.perform(line, this.get('sceneObjects'));
    },
    
    next() {
      const { action, line } = this.get('lineReader').nextLine();
      if (!action) { return; }

      const promise = new Promise((resolve) => {
        line.resolve = resolve;
        this.send('perform', action, line);
      });

      promise.then(() => {
        this.send('next');
      });
    }
  }
});
