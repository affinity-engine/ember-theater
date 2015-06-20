import Ember from 'ember';
import layout from '../templates/components/ember-theater-curtain';
import { pluralize } from 'ember-inflector';

const { Component, computed, get, inject, observer, on, set } = Ember;
const { filterBy, union } = computed;

export default Component.extend({
  layout: layout,
  classNames: ['ember-theater__curtain'],
  store: inject.service('store'),
  images: union('emberTheaterBackdrops', 'emberTheaterCharacterPortraits'),
  loadedImages: filterBy('images', 'fileLoaded', true),
  modelNames: ['ember-theater-backdrop', 'ember-theater-character-portrait'],

  _loadResources: on('didInsertElement', function() {
    const store = this.get('store');
    const modulePrefix = this.container.lookupFactory('config:environment').modulePrefix;

    this.get('modelNames').forEach((modelName) => {
      const pluralName = pluralize(modelName);
      const fixtures = window.require(`${modulePrefix}/fixtures/${pluralName}`).default;
      const data = store.pushMany(modelName, fixtures);
      this.set(Ember.String.camelize(pluralName), Ember.A(data));
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
      this.set('mediaLoaded', true);
    }
  })

});
