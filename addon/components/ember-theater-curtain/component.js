import Ember from 'ember';
import layout from './template';
import { singularize } from 'ember-inflector';
import ModulePrefixMixin from 'ember-theater/mixins/ember-theater-module-prefix';

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

export default Component.extend(ModulePrefixMixin, {
  classNames: ['ember-theater__curtain'],
  images: union('emberTheaterBackdrops', 'emberTheaterCharacterExpressions'),
  layout: layout,
  loadedImages: filterBy('images', 'fileLoaded', true),
  store: inject.service('store'),

  checkForMediaLoadCompletion: on('didRender', function() {
    if (this.get('imagesLoaded')) {
      this.attrs.complete();
    }
  }),

  imagesLoaded: computed('loadedImages.length', 'images.length', {
    get() {
      return this.get('loadedImages.length') >= this.get('images.length');
    }
  }),

  loadImages() {
    this.get('images').forEach((item) => {
      const image = new Image();
      image.src = get(item, 'src');

      image.onload = run.bind(this, () => {
        set(item, 'fileLoaded', true);
        this.rerender();
      });
    });
  },

  loadResources: on('didInsertElement', function() {
    const store = this.get('store');
    const modulePrefix = this.get('_modulePrefix');

    this.get('modelNames').forEach((modelName) => {
      const singularName = singularize(modelName);
      const fixtures = require(`${modulePrefix}/ember-theater-fixtures/${modelName}`)['default'];
      const data = store.pushMany(singularName, fixtures);

      this.set(Ember.String.camelize(modelName), Ember.A(data));
    });

    this.loadImages();
  }),

  modelNames: computed({
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
  })
});
