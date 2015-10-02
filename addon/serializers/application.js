import DS from 'ember-data';
import Ember from 'ember';

export default DS.JSONSerializer.extend({
  normalize(modelClass, resourceHash) {
    if (Ember.typeOf(resourceHash) === 'array') {
      return this.normalizeResponse(this.store, modelClass, resourceHash, null, 'findAll');
    } else {
      return this._super(modelClass, resourceHash);
    }
  }
});
