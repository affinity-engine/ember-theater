import Ember from 'ember';

const {
  computed,
  get,
  isPresent
} = Ember;

const configurableGet = function configurableGet(context, properties) {
  const config = get(context, 'config');
  const priorityProperty = properties.find((property) => get(context, property));

  return isPresent(priorityProperty) ? get(context, priorityProperty) : undefined;
};

export default function configurable(priorities, ...keys) {
  const properties = keys.reduce((props, key) => {
    priorities.forEach((priority) => props.push(`${priority}.${key}`));

    return props;
  }, []);

  return computed(...properties, {
    get() {
      return configurableGet(this, properties);
    }
  });
}
