import Ember from 'ember';

const { typeOf } = Ember;

export function emberTheaterJoinedArray(params/*, hash*/) {
  const array = params[0];
  const joinString = params[1] || ' ';

  return typeOf(array) === 'array' ? array.join(joinString) : array;
}

export default Ember.Helper.helper(emberTheaterJoinedArray);
