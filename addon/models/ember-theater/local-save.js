import DS from 'ember-data';
import Ember from 'ember';
import LokiJSModelMixin from 'ember-theater/mixins/lokijs-model';

const {
  Model,
  attr
} = DS;

const {
  computed,
  get
} = Ember;

export default Model.extend(LokiJSModelMixin, {
  isAutosave: attr('boolean'),
  name: attr('string'),
  sceneRecord: attr('object'),
  statePoints: attr('array'),

  activeState: computed('statePoints', {
    get() {
      const data = get(this, 'statePoints.lastObject');

      return Ember.Object.create(data);
    }
  }).readOnly(),

  updated: computed('meta.created', 'meta.updated', {
    get() {
      return get(this, 'meta.updated') || get(this, 'meta.created');
    }
  }).readOnly()
});
