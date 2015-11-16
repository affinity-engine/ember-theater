import DS from 'ember-data';
import Ember from 'ember';
import LokiJSModelMixin from 'ember-theater/mixins/lokijs-model';

const {
  attr,
  Model
} = DS;

const { computed } = Ember;

export default Model.extend(LokiJSModelMixin, {
  name: attr('string'),
  sceneRecord: attr('object'),
  statePoints: attr('array'),

  activeState: computed('statePoints', {
    get() {
      const data = this.get('statePoints.lastObject');

      return Ember.Object.create(data);
    }
  }).readOnly()
});
