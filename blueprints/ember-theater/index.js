module.exports = {
  description: 'Generates files for ember theater',

  normalizeEntityName: function() {},

  afterInstall: function() {
    var _this = this;

    return this.addAddonToProject({ name: 'ember-i18n', target: '4.2.0' }).then(function() {
      return _this.addAddonToProject({ name: 'ember-moment', target: '6.1.0' });
    });
  }
};
