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

const { inject: { service } } = Ember;
const { run: { later } } = Ember;

const { alias } = computed;

export default Component.extend({
  layout,

  classNames: ['et-curtain'],

  config: service('ember-theater/config'),
  preloader: service('preloader'),
  store: service('store'),
  translator: service('ember-theater/translator'),

  title: alias('config.title'),

  progressBarShape: computed('config.mediaLoader.progressBarStyle.shape', {
    get() {
      return get(this, 'config.mediaLoader.progressBarStyle.shape') || 'Circle';
    }
  }).readOnly(),

  _styleProgressBar: on('didInsertElement', function() {
    const config = get(this, 'config');

    const color = get(config, 'mediaLoader.progressBarStyle.color') || this.$().css('color');
    const trailColor = get(config, 'mediaLoader.progressBarStyle.trailColor') || 
      `rgba(${color.match(/(\d+)/g).slice(0, 3).join(', ')}, 0.62)`;
    const strokeWidth = get(config, 'mediaLoader.progressBarStyle.strokeWidth') || 4;
    const trailWidth = get(config, 'mediaLoader.progressBarStyle.trailWidth') || strokeWidth * 0.62;

    const options = {
      color,
      trailColor,
      strokeWidth,
      trailWidth
    }

    set(this, 'progressBarOptions', options);
  }),

  _loadModels: on('didInsertElement', function() {
    const store = get(this, 'store');

    get(this, '_modelNames').forEach((modelName) => {
      const singularModelName = singularize(modelName);
      const fixtures = requirejs(`${modulePrefix}/ember-theater/fixtures/${modelName}`).default;

      store.push(store.normalize(`ember-theater/${singularModelName}`, fixtures));
    });

    this._loadMedia();
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

  _loadMedia() {
    const store = get(this, 'store');
    const preloader = get(this, 'preloader');
    const paths = get(this, 'config.mediaLoader.mediaAttributes');
    const modelAttributePairs = paths.map((path) => {
      const [model, attribute] = path.split(':');

      return { model, attribute };
    });

    modelAttributePairs.forEach((pair) => {
      const models = store.peekAll(pair.model);
      const attribute = pair.attribute;

      models.forEach((model) => {
        const src = get(model, attribute);

        preloader.loadFile(src);
      });
    });

    preloader.onProgress(({ progress }) => set(this, 'progress', progress));

    preloader.onComplete(() => {
      later(() => {
        this.attrs.complete();
      }, 1000);
    });
  }
});
