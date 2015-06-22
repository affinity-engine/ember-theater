import Ember from 'ember';
import layout from '../templates/components/ember-theater-curtain';
import { singularize } from 'ember-inflector';
import ModulePrefixMixin from '../mixins/ember-theater-module-prefix';

const { Component, computed, get, inject, observer, on, set } = Ember;
const { filterBy, union } = computed;

export default Component.extend(ModulePrefixMixin, {
  layout: layout,
  classNames: ['ember-theater__curtain'],
  store: inject.service('store'),
  images: union('emberTheaterBackdrops', 'emberTheaterCharacterPortraits'),
  loadedImages: filterBy('images', 'fileLoaded', true),

  _modelNames: computed({
    get() {
      const paths = Object.keys(require.entries);
      const modulePrefix = this.get('_modulePrefix');
      const regex = new RegExp(`${modulePrefix}\/ember-theater-fixtures\/(.*)`);
      
      return paths.filter((path) => {
        return regex.test(path);
      }).map((path) => {
        return regex.exec(path)[1];
      });  
    }
  }),

  _loadResources: on('didInsertElement', function() {
    const store = this.get('store');
    const modulePrefix = this.get('_modulePrefix');

    this.get('_modelNames').forEach((modelName) => {
      const singularName = singularize(modelName);
      const fixtures = require(`${modulePrefix}/ember-theater-fixtures/${modelName}`)['default'];
      const data = store.pushMany(singularName, fixtures);
      this.set(Ember.String.camelize(modelName), Ember.A(data));
    });

    this._loadImages();
  }),

  _loadImages: observer('images', function() {
    this.get('images').forEach((item) => {
      const image = new Image();
      image.src = get(item, 'src');
      image.onload = function() {
        set(item, 'fileLoaded', true);
      };
    });
    this._checkForImageLoadCompletion();
  }),

  _checkForImageLoadCompletion: observer('loadedImages.length', 'images.length', function() {
    if (this.get('loadedImages.length') >= this.get('images.length')) {
      this.set('imagesLoaded', true);
    }
  }),

  _checkForMediaLoadCompletion: observer('imagesLoaded', function() {
    if (this.get('imagesLoaded')) {
      this.sendAction('complete');
    }
  })

});
