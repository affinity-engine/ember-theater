import Ember from 'ember';
import animate from 'ember-theater/utils/ember-theater/animate';

const {
  Mixin,
  K,
  computed,
  get,
  getProperties,
  guidFor,
  isBlank,
  merge,
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

  executeTransitions(transitions, resolve) {
    const transition = transitions.shift();

    if (isBlank(transition)) {
      return resolve();
    } else {
      const next = () => this.executeTransitions(transitions, resolve);

      switch(get(transition, 'type')) {
        case 'delay': return this.delay(transition).then(next);
        case 'expression': return this.changeExpression(transition).then(next);
        case 'transition': return this.executeTransition(transition).then(next);
      }
    }
  },

  delay(transition) {
    return new Promise((resolve) => {
      later(() => resolve(), get(transition, 'delay'));
    });
  },

  executeTransition(transition) {
    const effect = get(transition, 'effect');
    const options = getProperties(transition, ...Object.keys(transition));

    if (get(this, 'autoResolve')) {
      set(options, 'duration', 0);
    }

    return animate(this.element, effect, options).then(() => {
      set(this, 'style', this.$().attr('style'));
    });
  }
});
