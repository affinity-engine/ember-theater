import Ember from 'ember';

const {
  get,
  inject,
  isBlank,
  Service
} = Ember;

export default Service.extend({
  i18n: inject.service(),

  tryIntl(local, ...intlKeys) {
    let translation;
    const key = intlKeys.find((key) => {
      return key;
    });

    if (key) {
      translation = this.formatMessage(key);
    }

    if (isBlank(translation) || !translation) {
      return local;
    } else {
      return translation.string;
    }
  },

  formatMessage(data) {
    const i18n = this.get('i18n');
    const id = this.getId(data);

    if (!i18n.exists(id)) { return false; }
    
    return i18n.t(id, get(data, 'text.options'));
  },

  getId(data) {
    const text = get(data, 'text');

    if (isBlank(text)) { return data; }
    
    return get(text, 'id') ? get(text, 'id') : text;
  }
});
