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
    @returns {String}
  */
  translate(...metaTranslations) {
    const fallback = metaTranslations[0];
    const meta = metaTranslations.find((translation) => {
      return this._getTranslation(translation);
    });

    const translation = this._getTranslation(meta);

    return isBlank(translation) ? this._getId(fallback) : translation.string;
  },

  _getTranslation(meta) {
    const i18n = this.get('i18n');
    const id = this._getId(meta);

    if (i18n.exists(id)) {
      const options = get(meta, 'options') || get(meta, 'text.options');

      return i18n.t(id, options);
    }
  },

  /**
     The translation id can be nested in one of four places:

     ```js
       translatable: 'id';
       translatable: { text: 'id' };
       translatable: { text: { id: 'id', options: {} } };
       translatable: { id: 'id', options: {} };
     ```

     `getId` cycles through each of the possible locations and returns the first matching id.

     @method _getId
     @param {*} meta
     @returns {String}
     @private
  */
  _getId(meta) {
    // scenario: `undefined`
    if (isBlank(meta)) { return; }

    const text = get(meta, 'text');
    const id = isBlank(text) ? get(meta, 'id') : get(text, 'id');

    // scenario: `'id'`
    if (isBlank(id) && isBlank(text)) { return meta; }

    // scenario: `translatable: { text: 'id' }`
    if (isBlank(id)) { return text; }

    // scenario: `translatable: { id: 'id', options: {} }` || `translatable: { text: { id: 'id' } }`
    return id;
  }
});
