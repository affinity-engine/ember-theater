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

const deepMerge = function deepMerge(properties, context, initial = {}) {
  const mergedProperty = properties.reduce((accumulator, property) => {
    const nextValue = get(context, property) || {};

    return extend({}, nextValue, accumulator);
  }, initial);

  return Ember.Object.create(mergedProperty);
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
      return deepMerge(properties, this);
    }
  });
}

export function deepArrayConfigurable(priorities, primaryKey, keys) {
  const properties = createKeyPriorityPairs(priorities, keys);

  return computed(`${primaryKey}.[]`, ...properties, {
    get() {
      const array = (get(this, primaryKey) || []).map((item) => {
        return deepMerge(properties, this, item);
      });

      return Ember.A(array);
    }
  });
}
