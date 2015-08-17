import Ember from 'ember';

const {
  get,
  inject,
  Service
} = Ember;

export default Service.extend({
  intl: inject.service(),

  formatMessage(key) {
    const intl = this.get('intl');
    const locale = intl.get('locale');
    const translation = intl.get('adapter').findTranslationByKey(locale, this.getId(key)); 

    return intl.formatMessage(translation, get(key, 'options'));
  },

  getId(key) {
    return get(key, 'id') ? get(key, 'id') : key;
  }
});
