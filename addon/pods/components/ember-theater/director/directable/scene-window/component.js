import Ember from 'ember';
import layout from './template';
import DirectableComponentMixin from 'ember-theater/mixins/ember-theater/director/directable-component';

const {
  Component,
  get,
  isPresent,
  on,
  set
} = Ember;

const { computed: { reads } } = Ember;

export default Component.extend(DirectableComponentMixin, {
  layout,
  classNames: ['et-scene-window'],

  sceneId: reads('directable.attrs.sceneId'),
  sceneWindowId: reads('directable.attrs.sceneWindowId'),

  handlePriorSceneRecord: on('didReceiveAttrs', function() {
    const sceneRecord = get(this, 'priorSceneRecord') || {};

    set(this, 'sceneRecord', sceneRecord);
    set(this, 'directable.direction.result', sceneRecord);

    this.resolve();
  })
});
