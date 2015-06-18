import Ember from 'ember';
import layout from '../templates/components/ember-theater-curtain';

const { Component, RSVP, computed, get, inject, observer, on, set } = Ember;
const { filterBy, union } = computed;

export default Component.extend({
  layout: layout,
  classNames: ['ember-theater__curtain'],
  store: inject.service('store'),
  images: union('backdrops', 'portraits'),
  loadedImages: filterBy('images', 'fileLoaded', true),

  _loadResources: on('didInsertElement', function() {
    const store = this.get('store');
    RSVP.hash({
      backdrops: store.find('ember-theater-backdrop'),
      portraits: store.find('ember-theater-character-portrait')
    }).then((resources) => {
      this.setProperties({
        backdrops: resources.backdrops,
        portraits: resources.portraits
      });
      this._loadImages();
    });
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
