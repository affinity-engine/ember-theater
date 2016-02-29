import Ember from 'ember';

const {
  computed,
  get,
  isPresent
} = Ember;

const extend = Ember.$.extend;

const createKeyPriorityPairs = function createKeyPriorityPairs(priorities, ...keys) {
  return keys.reduce((props, key) => {
    priorities.forEach((priority) => props.push(`${priority}.${key}`));

    return props;
  }, []);
};

export default function configurable(priorities, keys) {
  const properties = createKeyPriorityPairs(priorities, keys);

  return computed(...properties, {
    get() {
      const priorityProperty = properties.find((property) => get(this, property));

      return isPresent(priorityProperty) ? get(this, priorityProperty) : undefined;
    }
  });
}

export function deepConfigurable(priorities, keys) {
  const properties = createKeyPriorityPairs(priorities, keys);

  return computed(...properties, {
    get() {
      const mergedProperty = properties.reduce((accumulator, property) => {
        return extend({}, get(this, property) || {}, accumulator);
      }, {});

      return Ember.Object.create(mergedProperty);
    }
  });
}
