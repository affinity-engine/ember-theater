import Ember from 'ember';

const { Mixin } = Ember;

export default Mixin.create({
  normalize(modelClass, resourceHash) {
    return Ember.typeOf(resourceHash) === 'array' ?
      this.normalizeResponse(this.store, modelClass, resourceHash, null, 'findAll') :
      this._super(modelClass, resourceHash);
  }
});
