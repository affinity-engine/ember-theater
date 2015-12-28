import Ember from 'ember';

const {
  computed,
  get
} = Ember;

const configurableGet = function configurableGet(context, category, keys) {
  const config = get(context, 'config');

  const directableOption = keys.find((key) => get(context, `directable.options.${key}`));
  const configCategory = keys.find((key) => get(context, `config.director.${category}.${key}`));
  const configGlobal = keys.find((key) => get(context, `config.globals.${key}`));

  return get(context, `directable.options.${directableOption}`) ||
    config.getProperty(`director.${category}`, configCategory) ||
    config.getProperty(category, configGlobal);
};

export function configurableClassNames(category) {
  return computed('directable.options.decorativeClassNames',
    `config.director.${category}.decorativeClassNames`,
    'config.globals.decorativeClassNames',
    'directable.options.structuralClassNames',
    `config.director.${category}.structuralClassNames`,
    'config.globals.structuralClassNames', {
      get() {
        const decorativeClassNames = configurableGet(this, category, ['decorativeClassNames']);
        const structuralClassNames = configurableGet(this, category, ['structuralClassNames']);

        return decorativeClassNames.concat(structuralClassNames).join(' ');
      }
    }).readOnly();
}

export default function configurable(category, ...keys) {
  const properties = keys.reduce((props, key) => {
    props.push(`directable.options.${key}`);
    props.push(`config.director.${category}.${key}`);
    props.push(`config.globals.${key}`);

    return props;
  }, []);

  return computed(...properties, {
    get() {
      return configurableGet(this, category, keys);
    }
  }).readOnly();
}
