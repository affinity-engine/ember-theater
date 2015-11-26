import Ember from 'ember';

const {
  computed,
  get
} = Ember;

export default function configurable(category, ...keys) {
  const properties = keys.reduce((properties, key) => {
    properties.push(`directable.options.${key}`);
    properties.push(`config.${category}.${key}`);
    properties.push(`config.globals.${key}`);

    return properties;
  }, []);

  return computed(...properties, {
    get() {
      const config = get(this, 'config');

      const directableOption = keys.find((key) => get(this, `directable.options.${key}`));
      const configCategory = keys.find((key) => get(this, `config.${category}.${key}`));
      const configGlobal = keys.find((key) => get(this, `config.globals.${key}`));

      return directableOption ||
        config.getProperty(category, configCategory) ||
        config.getProperty(category, configGlobal);
    }
  }).readOnly()
};
