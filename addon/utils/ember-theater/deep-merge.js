import Ember from 'ember';

const {
  get,
  set,
  typeOf
} = Ember;

export default function merge(...args) {
  const target = args[0] || {};
  const source = args[1];

  Object.keys(source).forEach((key) => {
    const sourceProperty = get(source, key);

    if (typeOf(sourceProperty) === 'object') {
      set(target, key, merge(get(target, key), sourceProperty));
    } else {
      set(target, key, sourceProperty);
    }
  });

  for (let a = 2, l = args.length; a < l; a++) {
    merge(target, args[a]);
  }

  return target;
}
