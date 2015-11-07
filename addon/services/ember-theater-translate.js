import Ember from 'ember';

const {
  get,
  inject,
  isBlank,
  Service
} = Ember;

export default Service.extend({
  i18n: inject.service(),

  /**
    Translates and returns the first valid `metaTranslations`, if any. Otherwise, returns
    the first `metaTranslations` without translating it.
    
    @method translate
    @param {Array} metaTranslations
  */
  translate(...metaTranslations) {
    const fallback = metaTranslations[0];
    const meta = metaTranslations.find((meta) => {
      return this._getTranslation(meta);
    });

    const translation = this._getTranslation(meta);

    if (isBlank(translation)) {
      return this._getId(fallback);
    } else {
      return translation.string;
    }
  },

  _getTranslation(meta) {
    const i18n = this.get('i18n');
    const id = this._getId(meta);

    if (i18n.exists(id)) { 
      return i18n.t(id, get(meta, 'text.options'));
    }
  },

  /**
     The translation id can be nested in one of three places:
     
     ```js
       translatable: 'id';
       translatable: { text: 'id' };
       translatable: { text: { id: 'id', options: {} };
     ```

     `getId` cycles through each of the possible locations and returns the first matching id.

     @method _getId
     @param {*} meta
     @private
  */
  _getId(meta) {
    // scenario: `translatable: undefined`
    if (isBlank(meta)) { return; }

    // scenario: `translatable: 'id'`
    const text = get(meta, 'text');
    if (isBlank(text)) { return meta; }
    
    // scenario: `translatable: { text: 'id' }`
    const id = get(text, 'id');
    if (isBlank(id)) { return text; }

    // scenario: `translatable: { text: { id: 'id', options: {} }`
    return id;
  }
});
