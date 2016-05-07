import Ember from 'ember';
import animate from 'ember-theater/utils/ember-theater/animate';

const {
  Mixin,
  K,
  computed,
  get,
  getProperties,
  isBlank,
  isPresent,
  set
} = Ember;

const { Handlebars: { SafeString } } = Ember;
const { RSVP: { Promise } } = Ember;
const { run: { later } } = Ember;

export default Mixin.create({
  attributeBindings: ['style'],

  style: computed('styles.[]', '_style', {
    get() {
      const styles = get(this, 'styles') || [];
      const _style = get(this, '_style') || '';

      styles.push(_style);

      const uniqueStyles = Ember.A(styles.join(' ').split(';').map((string) => string.trim())).uniq().join('; ');

      return new SafeString(uniqueStyles);
    },
    set(attr, style) {
      return set(this, '_style', style);
    }
  }),

  executeTransitionIn() {
    const transition = get(this, 'transitionIn');

    return this.executeTransition(transition);
  },

  executeTransitionOut() {
    const transition = get(this, 'transitionOut');

    return this.executeTransition(transition);
  },

  executeTransitions(transitions) {
    return new Promise((resolve) => {
      this._executeTransitions(transitions, 'main', resolve);
    });
  },

  _executeTransitions(transitions, parentQueue, resolve = K) {
    const transition = transitions.shift();

    if (isBlank(transition)) {
      resolve();
    } else {
      const promise = this._transitionSwitch(transition);

      const queue = get(transition, 'queue');

      const next = () => {
        this._executeTransitions(transitions, parentQueue, resolve);
      };

      if (queue === parentQueue) {
        promise.then(next);
      } else {
        this._startParallelQueue(queue, transitions);

        return next();
      }
    }
  },

  _transitionSwitch(transition) {
    switch (get(transition, 'type')) {
      case 'delay': return this.delay(transition);
      case 'crossFade': return this.crossFade(transition);
      case 'filter': return this.addFilter(transition);
      case 'transition': return this.executeTransition(transition);
    }
  },

  _startParallelQueue(queue, transitions) {
    const exitTransition = transitions.find((transition) => get(transition, 'queue') !== queue);
    const queueLength = transitions.indexOf(exitTransition);

    this._executeTransitions(transitions.splice(0, queueLength), queue);
  },

  delay(transition) {
    return new Promise((resolve) => {
      later(() => resolve(), get(transition, 'delay'));
    });
  },

  executeTransition(transition) {
    const effect = get(transition, 'effect');
    const options = getProperties(transition, ...Object.keys(transition));

    Reflect.deleteProperty(options, 'queue');

    if (isPresent(get(this, 'priorSceneRecord'))) {
      set(options, 'duration', 0);
    }

    return animate(this.element, effect, options).then(() => {
      if (isPresent(this.element)) {
        set(this, 'style', this.$().attr('style'));
      }
    });
  }
});
