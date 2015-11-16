import Ember from 'ember';
import layout from './template';
import { singularize } from 'ember-inflector';
import config from 'ember-get-config';

const modulePrefix = config.modulePrefix;

const {
  Component,
  computed,
  get,
  inject,
  on,
  run,
  set
} = Ember;

const {
  filterBy,
  union
} = computed;

export default Component.extend({
  classNames: ['ember-theater__curtain'],
  images: union('emberTheaterBackdrops', 'emberTheaterCharacterExpressions'),
  layout: layout,
  loadedImages: filterBy('images', 'fileLoaded', true),
  loadedSounds: filterBy('emberTheaterSounds', 'audio'),
  store: inject.service('store'),

  checkForMediaLoadCompletion: on('didRender', function() {
    if (this.get('imagesLoaded') && this.get('soundsLoaded')) {
      this.attrs.complete();
    }
  }),

  imagesLoaded: computed('loadedImages.length', 'images.length', {
    get() {
      return this.get('loadedImages.length') >= this.get('images.length');
    }
  }),

  loadImages() {
    const images = this.get('images');
    if (!images) { return this.set('images', Ember.A()); }

    images.forEach((item) => {
      const image = new Image();
      image.src = get(item, 'src');

      image.onload = run.bind(this, () => {
        set(item, 'fileLoaded', true);
        this.rerender();
      });
    });
  },

  loadSounds() {
    const sounds = this.get('emberTheaterSounds');
    if (!sounds) { return this.set('emberTheaterSounds', Ember.A()); }

    sounds.forEach((item) => {
      const audio = new window.buzz.sound(get(item, 'path'), {
        formats: get(item, 'formats'),
        preload: true,
        webAudioApi: true
      });

      audio.bindOnce('canplaythrough', () => {
        set(item, 'audio', audio);
        this.rerender();
      });
    });
  },

  loadResources: on('didInsertElement', function() {
    const store = this.get('store');

    this.get('modelNames').forEach((modelName) => {
      const singularModelName = singularize(modelName);
      const fixtures = require(`${modulePrefix}/ember-theater/fixtures/${modelName}`)['default'];
      const data = store.push(store.normalize(`ember-theater/${singularModelName}`, fixtures));

      this.set(Ember.String.camelize(modelName), Ember.A(data));
    });

    this.loadImages();
    this.loadSounds();
  }),

  modelNames: computed({
    get() {
      const paths = Object.keys(require.entries);
      const regex = new RegExp(`${modulePrefix}\/ember-theater/fixtures\/(.*)`);

      return paths.filter((path) => {
        return regex.test(path);
      }).map((path) => {
        return regex.exec(path)[1];
      });
    }
  }),

  soundsLoaded: computed('loadedSounds.length', 'emberTheaterSounds.length', {
    get() {
      return this.get('loadedSounds.length') >= this.get('emberTheaterSounds.length');
    }
  })
});
