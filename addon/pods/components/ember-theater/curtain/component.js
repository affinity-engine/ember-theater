import Ember from 'ember';
import layout from './template';
import animate from 'ember-theater/utils/ember-theater/animate';
import ConfigurableMixin from 'ember-theater/mixins/ember-theater/configurable';
import multiton from 'ember-multiton-service';
import configurable from 'ember-theater/macros/ember-theater/configurable';

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

const configurablePriority = ['config.attrs.curtain', 'config.attrs.globals'];

export default Component.extend(ConfigurableMixin, {
  layout,

  classNames: ['et-curtain'],

  translator: service('ember-theater/translator'),
  fixtureStore: multiton('ember-theater/fixture-store', 'theaterId'),
  preloader: multiton('ember-theater/preloader', 'theaterId'),

  baseTitle: configurable(configurablePriority, 'title'),
  transitionOut: configurable(configurablePriority, 'transitionOut.effect'),
  transitionOutDuration: configurable(configurablePriority, 'transitionOut.duration', 'transitionDuration'),

  title: computed('baseTitle', {
    get() {
      return get(this, 'translator').translate(get(this, 'baseTitle'));
    }
  }),

  progressBarShape: computed('config.attrs.curtain.progressBarStyle.shape', {
    get() {
      return get(this, 'config.attrs.curtain.progressBarStyle.shape') || 'Circle';
    }
  }),

  _styleProgressBar: on('init', function() {
    const config = get(this, 'config.attrs');

    const color = get(config, 'curtain.progressBarStyle.color') || 'rgb(250, 250, 250)';
    const trailColor = get(config, 'curtain.progressBarStyle.trailColor') ||
      `rgba(${color.match(/(\d+)/g).slice(0, 3).join(', ')}, 0.62)`;
    const strokeWidth = get(config, 'curtain.progressBarStyle.strokeWidth') || 4;
    const trailWidth = get(config, 'curtain.progressBarStyle.trailWidth') || strokeWidth * 0.62;

    const options = {
      color,
      trailColor,
      strokeWidth,
      trailWidth
    };

    set(this, 'progressBarOptions', options);
  }),

  _loadMedia: on('init', function() {
    const fixtureStore = get(this, 'fixtureStore');
    const preloader = get(this, 'preloader');
    const paths = get(this, 'filesToPreload').split(' ');
    const fixtureAttributePairs = paths.map((path) => {
      const [fixture, attribute] = path.split(':');

      return { fixture, attribute };
    });

    fixtureAttributePairs.forEach((pair) => {
      const fixtureName = camelize(pair.fixture);
      const fixtures = fixtureStore.findAll(fixtureName);
      const attribute = pair.attribute;

      fixtures.forEach((fixture) => {
        const src = get(fixture, attribute);
        const id = preloader.idFor(fixture, attribute);

        preloader.loadFile({ src, id });
      });
    });

    preloader.onProgress(({ progress }) => set(this, 'progress', progress));

    preloader.onComplete(() => {
      this._complete();
    });
  }),

  _complete() {
    later(() => {
      const effect = get(this, 'transitionOut');
      const duration = get(this, 'transitionOutDuration');

      animate(this.element, effect, { duration }).then(() => {
        this.attrs.completePreload();
      });
    }, 750);
  }
});
