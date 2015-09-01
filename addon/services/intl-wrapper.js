import Ember from 'ember';

const {
  get,
  inject,
  Service
} = Ember;

export default Service.extend({
  intl: inject.service(),

  tryIntl(local, ...intlKeys) {
    let translation;
    const key = intlKeys.find((key) => {
      return key;
    });

    if (key) {
      translation = this.formatMessage(key);
    }

    if (translation) {
      return translation;
    } else {
      return local;
    }
  },

  formatMessage(key) {
    const intl = this.get('intl');
    const locale = intl.get('locale');
    const translation = intl.get('adapter').findTranslationByKey(locale, this.getId(key)); 
    
    if (translation) { 
      return intl.formatMessage(translation, get(key, 'options'));
    }
  },

  getId(key) {
    return get(key, 'id') ? get(key, 'id') : key;
  }
});
