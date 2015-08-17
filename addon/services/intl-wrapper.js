import Ember from 'ember';

const {
  inject,
  Service
} = Ember;

export default Service.extend({
  intl: inject.service(),

  formatMessage(key, options) {
    const intl = this.get('intl');
    const locale = intl.get('locale');
    const translation = intl.get('adapter').findTranslationByKey(locale, key); 

    return intl.formatMessage(translation, options);
  },

  getKey(item) {
    return item.id ? item.id : item;
  }
});
