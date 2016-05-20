import en from 'ember-theater/locales/ember-theater/en/translations'

export function initialize(appInstance) {
  const i18n = appInstance.lookup('service:i18n');

  i18n.addTranslations('en', en);
}

export default {
  name: 'ember-theater/load-translations',
  initialize
};
