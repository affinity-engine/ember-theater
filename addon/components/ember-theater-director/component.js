import Ember from 'ember';
import layout from './template';
import ModulePrefixMixin from 'ember-theater/mixins/ember-theater-module-prefix';

const {
  Component,
  inject,
  observer,
  RSVP
} = Ember;

const { Promise } = RSVP;

export default Component.extend(ModulePrefixMixin, {
  classNames: ['ember-theater__director'],
  layout: layout,
  lineReader: inject.service(),
  sceneObjects: Ember.A([]),

  loadScene: observer('scene', function() {
    this.get('lineReader').set('scene', this.get('scene'));
    this.send('next');
  }),

  actions: {
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
    },

    perform(action, line) {
      const modulePrefix = this.get('_modulePrefix');
      const path = `${modulePrefix}/ember-theater-directions/${Ember.String.dasherize(action)}`;
      const direction = require(path)['default'];

      direction.set('container', this.get('container'));
      direction.perform(line, this.get('sceneObjects'));
    }
  }
});
