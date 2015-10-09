import Ember from 'ember';

const { Mixin } = Ember;

export default Mixin.create({
  normalize(modelClass, resourceHash) {
    if (Ember.typeOf(resourceHash) === 'array') {
      return this.normalizeResponse(this.store, modelClass, resourceHash, null, 'findAll');
    } else {
      return this._super(modelClass, resourceHash);
    }
  }
});
