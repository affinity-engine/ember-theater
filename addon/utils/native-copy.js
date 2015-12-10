import Ember from 'ember';

const { isEmpty } = Ember;

export default function nativeCopy(object) {
  if (isEmpty(object)) { return object; }

  return JSON.parse(JSON.stringify(object));
}
