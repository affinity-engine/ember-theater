import Ember from 'ember';
import layout from './template';
import { singularize } from 'ember-inflector';
import config from 'ember-get-config';

const modulePrefix = config.modulePrefix;

const {
  Component,
  computed,
  get,
  on,
  run,
  set
} = Ember;

const {
  filterBy,
  union
} = computed;

const { inject: { service } } = Ember;

export default Component.extend({
  layout,

  classNames: ['et-curtain'],
  images: computed(() => Ember.A()),
  sounds: computed(() => Ember.A()),

  config: service('ember-theater/config'),
  store: service('store'),

  message: computed('imagesLoaded', 'soundsLoaded', {
    get() {
      if (!get(this, 'imagesLoaded')) {
        return 'Loading images';
      } else if (!get(this, 'soundsLoaded')) {
        return 'Loading sounds';
      } else {
        return 'Complete!!!';
      }
    }
  }).readOnly(),

  loadModels: on('didInsertElement', function() {
    const store = get(this, 'store');

    get(this, '_modelNames').forEach((modelName) => {
      const singularModelName = singularize(modelName);
      const fixtures = requirejs(`${modulePrefix}/ember-theater/fixtures/${modelName}`).default;
      const data = store.push(store.normalize(`ember-theater/${singularModelName}`, fixtures));
    });

    this._loadImages();
    this._loadSounds();
  }),

  checkForMediaLoadCompletion: on('didRender', function() {
    if (get(this, 'imagesLoaded') && get(this, 'soundsLoaded')) {
      this.attrs.complete();
    }
  }),

  _modelNames: computed({
    get() {
      const paths = Object.keys(requirejs.entries);
      const regex = new RegExp(`${modulePrefix}\/ember-theater/fixtures\/(.*)`);

      return paths.filter((path) => {
        return regex.test(path);
      }).map((path) => {
        return regex.exec(path)[1];
      });
    }
  }),

  loadedImages: computed('images.@each.imagesCount', 'images.@each.imagesLoaded', {
    get() {
      return get(this, 'images').filter((image) => {
        return get(image, 'imagesCount') === get(image, 'imagesLoaded');
      });
    }
  }).readOnly(),

  loadedSounds: computed('sounds.@each.soundsCount', 'sounds.@each.soundsLoaded', {
    get() {
      return get(this, 'sounds').filter((sound) => {
        return get(sound, 'soundsCount') === get(sound, 'soundsLoaded');
      });
    }
  }).readOnly(),

  imagesLoaded: computed('loadedImages.[]', 'images.[]', {
    get() {
      return get(this, 'loadedImages.length') >= get(this, 'images.length');
    }
  }),

  soundsLoaded: computed('loadedSounds.[]', 'sounds.[]', {
    get() {
      return get(this, 'loadedSounds.length') >= get(this, 'sounds.length');
    }
  }),

  _loadImages() {
    const group = get(this, 'images');
    const paths = get(this, 'config.mediaLoader.images');

    this._loadMedia(group, paths, (model, attribute) => {
      model.incrementProperty('imagesCount');

      const image = new Image();

      image.src = get(model, attribute);

      image.onload = run.bind(this, () => {
        model.incrementProperty('imagesLoaded');
      });
    });
  },

  _loadSounds() {
    const group = get(this, 'sounds');
    const paths = get(this, 'config.mediaLoader.sounds');

    this._loadMedia(group, paths, (model, attribute) => {
      model.incrementProperty('soundsCount');

      const audio = new window.buzz.sound(get(model, attribute), {
        formats: get(model, `${attribute}Formats`),
        preload: true,
        webAudioApi: true
      });

      audio.bindOnce('canplaythrough', () => {
        model.incrementProperty('soundsLoaded');

        set(model, `${attribute}Audio`, audio);
      });
    });
  },

  _loadMedia(group, paths, callback) {
    const store = get(this, 'store');
    const modelAttributePairs = paths.map((path) => {
      const [ model, attribute ] = path.split(':');

      return { model, attribute };
    });

    modelAttributePairs.forEach((pair) => {
      const models = store.peekAll(pair.model);
      const attribute = pair.attribute;

      models.forEach((model) => {
        group.pushObject(model);
        callback(model, attribute);
      });
    });
  }
});
