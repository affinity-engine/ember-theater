import Ember from 'ember';

const {
  get,
  set,
  typeOf
} = Ember;

export default function merge(target = {}, source) {
  Object.keys(source).forEach((key) => {
    const sourceProperty = get(source, key);

    if (typeOf(sourceProperty) === 'object') {
      set(target, key, merge(get(target, key), sourceProperty));
    } else {
      set(target, key, sourceProperty);
    }
  });

  for (let a = 2, l = arguments.length; a < l; a++) {
    merge(target, arguments[a]);
  }

  return target;
};
