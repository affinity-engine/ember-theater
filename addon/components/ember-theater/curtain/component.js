import Ember from 'ember';
import layout from './template';
import animate from 'ember-theater/utils/ember-theater/animate';
import appConfig from 'ember-get-config';
import ConfigurableMixin from 'ember-theater/mixins/ember-theater/configurable';
import multiService from 'ember-theater/macros/ember-theater/multi-service';

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
  fixtureStores: service('ember-theater/fixture-store'),

  fixtureStore: multiService('fixtureStores'),

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
    };

    set(this, 'progressBarOptions', options);
  }),

  _loadfixtures: on('didInsertElement', function() {
    const fixtureStore = get(this, 'fixtureStore');

    get(this, '_fixtureNames').forEach((fixtureName) => {
      const fixtures = requirejs(`${modulePrefix}/ember-theater/fixtures/${fixtureName}`).default;

      set(fixtureStore, this._standardizeFixtureName(fixtureName), Ember.A(fixtures));
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
    const paths = get(this, 'config.mediaLoader.filesToPreload');
    const fixtureAttributePairs = paths.map((path) => {
      const [fixture, attribute] = path.split(':');

      return { fixture, attribute };
    });

    fixtureAttributePairs.forEach((pair) => {
      const fixtures = get(fixtureStore, this._standardizeFixtureName(pair.fixture));
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
        const duration = get(this, 'config.mediaLoader.fadeOutDuration') || 500;

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
