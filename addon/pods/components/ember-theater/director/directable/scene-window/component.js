import Ember from 'ember';
import layout from './template';
import BusSubscriberMixin from 'ember-theater/mixins/ember-theater/bus-subscriber';
import DirectableComponentMixin from 'ember-theater/mixins/ember-theater/director/directable-component';
import configurable, { deepConfigurable, deepArrayConfigurable } from 'ember-theater/macros/ember-theater/configurable';

const {
  Component,
  computed,
  get,
  isPresent,
  on,
  set
} = Ember;

const { computed: { reads } } = Ember;

const configurablePriority = [
  'directable.attrs',
  'config.attrs.director.scene',
  'config.attrs.globals'
];

export default Component.extend(BusSubscriberMixin, DirectableComponentMixin, {
  layout,

  attributeBindings: ['sceneWindowId:data-scene-window-id'],
  classNames: ['et-scene-window'],

  configurableClassNames: configurable(configurablePriority, 'classNames'),
  priority: configurable(configurablePriority, 'priority'),
  sceneId: configurable(configurablePriority, 'sceneId'),
  sceneWindowId: configurable(configurablePriority, 'sceneWindowId'),
  screen: configurable(configurablePriority, 'screen'),

  style: computed('priority', {
    get() {
      const priority = get(this, 'priority') * 1000;

      return `z-index: ${priority};`;
    }
  }).readOnly(),

  setupEvents: on('init', function() {
    const windowId = get(this, 'sceneWindowId');

    this.on(`et:${windowId}:closeWindow`, this, this.removeDirectable);
  }),

  handlePriorSceneRecord: on('didReceiveAttrs', function() {
    const sceneRecord = get(this, 'priorSceneRecord') || {};

    set(this, 'sceneRecord', sceneRecord);
    set(this, 'directable.direction.result', sceneRecord);

    this.resolve();
  })
});
