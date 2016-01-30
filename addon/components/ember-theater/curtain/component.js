import Ember from 'ember';
import layout from './template';
import animate from 'ember-theater/utils/ember-theater/animate';
import appConfig from 'ember-get-config';
import ConfigurableMixin from 'ember-theater/mixins/ember-theater/configurable';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const { modulePrefix } = appConfig;

const {
  Component,
  computed,
  get,
  on,
  set
} = Ember;

const { inject: { service } } = Ember;
const { run: { later } } = Ember;
const { String: { camelize } } = Ember;

const { alias } = computed;

export default Component.extend(ConfigurableMixin, {
  layout,

  classNames: ['et-curtain'],

  preloader: service('preloader'),
  translator: service('ember-theater/translator'),
  fixtureStore: multitonService('ember-theater/fixture-store', 'theaterId'),

  title: alias('config.attrs.title'),

  progressBarShape: computed('config.attrs.mediaLoader.progressBarStyle.shape', {
    get() {
      return get(this, 'config.attrs,mediaLoader.progressBarStyle.shape') || 'Circle';
    }
  }).readOnly(),

  _styleProgressBar: on('didInsertElement', function() {
    const config = get(this, 'config.attrs');

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
    };

    set(this, 'progressBarOptions', options);
  }),

  _loadfixtures: on('didInsertElement', function() {
    const fixtureStore = get(this, 'fixtureStore');
    const fixtureMap = get(this, 'config.attrs.fixtures');
    const fixtureKeys = Object.keys(fixtureMap);

    fixtureKeys.forEach((key) => {
      fixtureStore.add(key, fixtureMap[key]);
    });

    this._loadMedia();
  }),

  _fixtureNames: computed({
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
    const fixtureStore = get(this, 'fixtureStore');
    const preloader = get(this, 'preloader');
    const paths = get(this, 'config.attrs.mediaLoader.filesToPreload');
    const fixtureAttributePairs = paths.map((path) => {
      const [fixture, attribute] = path.split(':');

      return { fixture, attribute };
    });

    fixtureAttributePairs.forEach((pair) => {
      const fixtures = fixtureStore.findAll(this._standardizeFixtureName(pair.fixture));
      const attribute = pair.attribute;

      fixtures.forEach((fixture) => {
        const src = get(fixture, attribute);
        const id = preloader.idFor(fixture, attribute);

        preloader.loadFile({ src, id });
      });
    });

    preloader.onProgress(({ progress }) => set(this, 'progress', progress));

    preloader.onComplete(() => {
      later(() => {
        const duration = get(this, 'config.attrs.mediaLoader.fadeOutDuration') || 500;

        animate(this.element, { opacity: 0 }, { duration }).then(() => {
          this.attrs.complete();
        });
      }, 750);
    });
  },

  _standardizeFixtureName(name) {
    return camelize(name);
  }
});
