import Ember from 'ember';

const { set } = Ember;

export default function deepStub(path, attribute, value) {
  const container = { };

  path.split('.').reduce((parentObject, segment) => {
    const childObject = { };

    parentObject[segment] = childObject;

    return childObject;
  }, container);

  set(container, `${path}.${attribute}`, value);

  return container;
}
