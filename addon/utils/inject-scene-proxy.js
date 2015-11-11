import Ember from 'ember';

const { get } = Ember;
const { String: { camelize, capitalize } } = Ember;

export default function injectSceneProxy(application, type, name) {
  const proxy = function proxy(...args) {
    // the scene is the context here 
    const factory = get(this, 'container').lookupFactory(`${type}:${name}`);
    const method = `proxy${capitalize(type)}`;

    return this[method](name, factory, args);
  };

  application.inject('direction', 'store', `service:store`);
  application.register(`${type}:${name}-proxy`, proxy, { instantiate: false });
  application.inject('scene', camelize(name), `${type}:${name}-proxy`);
};
