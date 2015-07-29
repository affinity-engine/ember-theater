import Ember from 'ember';
import layout from './template';
import ModulePrefixMixin from 'ember-theater/mixins/ember-theater-module-prefix';

const {
  Component,
  observer
} = Ember;

export default Component.extend(ModulePrefixMixin, {
  classNames: ['ember-theater__director'],
  layout: layout,
  sceneObjectContainers: Ember.A([]),

  loadScene: observer('scene', function() {
    const sceneObjectContainers = this.get('sceneObjectContainers');

    this.get('scene').performScript(sceneObjectContainers);
  })
});
