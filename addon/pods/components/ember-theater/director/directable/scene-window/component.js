import Ember from 'ember';
import layout from './template';
import BusSubscriberMixin from 'ember-theater/mixins/ember-theater/bus-subscriber';
import DirectableComponentMixin from 'ember-theater/mixins/ember-theater/director/directable-component';
import TransitionMixin from 'ember-theater/mixins/ember-theater/director/transition';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
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
  'config.attrs.director',
  'config.attrs.globals'
];

export default Component.extend(BusSubscriberMixin, DirectableComponentMixin, TransitionMixin, {
  layout,

  attributeBindings: ['sceneWindowId:data-scene-window-id'],
  classNames: ['et-scene-window'],

  config: multitonService('ember-theater/config', 'theaterId'),

  configurableClassNames: configurable(configurablePriority, 'classNames'),
  priority: configurable(configurablePriority, 'priority'),
  sceneId: configurable(configurablePriority, 'sceneId'),
  sceneWindowId: configurable(configurablePriority, 'sceneWindowId'),
  screen: configurable(configurablePriority, 'screen'),
  transitionIn: deepConfigurable(configurablePriority, 'transitionIn'),
  transitionOut: deepConfigurable(configurablePriority, 'transitionOut'),
  window: configurable(configurablePriority, 'window'),

  childStyle: computed('priority', {
    get() {
      const priority = get(this, 'priority') * 1000;

      return `z-index: ${priority};`;
    }
  }).readOnly(),

  setupEvents: on('init', function() {
    const sceneWindowId = get(this, 'sceneWindowId');

    this.on(`et:${sceneWindowId}:closeWindow`, this, this.close);
  }),

  handlePriorSceneRecord: on('didReceiveAttrs', function() {
    const sceneRecord = get(this, 'priorSceneRecord') || {};

    set(this, 'sceneRecord', sceneRecord);
    set(this, 'directable.direction.result', sceneRecord);
  }),

  transitionInWindow: on('didInsertElement', function() {
    this.executeTransitionIn().then(() => {
      this.resolve();
    });
  }),

  close() {
    this.executeTransitionOut().then(() => {
      this.removeDirectable();
    });
  }
});
