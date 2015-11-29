import en from 'ember-theater/locales/en/ember-theater';

export function initialize(container) {
  const i18n = container.lookup('service:i18n');

  i18n.addTranslations('en', en);
}

export default {
  name: 'ember-theater/load-translations',
  initialize: initialize
};
