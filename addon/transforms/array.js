import DS from 'ember-data';
import Ember from 'ember';

const { Transform } = DS;

export default Transform.extend({
  deserialize: function(serialized) {
    switch (Ember.typeOf(serialized)) {
      case 'array': return serialized;
      case 'string': return [serialized];
      default: return [];
    }
  },

  serialize: function(deserialized) {
    return deserialized;
  }
});
