import Ember from 'ember';
import animate from 'ember-theater/utils/animate';

const {
  Component,
  computed,
  inject,
  merge,
  on
} = Ember;

const { alias } = computed;

export default Component.extend({
  attributeBindings: ['caption:alt', 'src'],
  classNames: ['et-character-expression'],
  previousLine: null,
  intlWrapper: inject.service(),
  src: alias('expression.src'),
  tagName: 'img',

  caption: computed('expression.caption', {
    get() {
      return this.get('intlWrapper').tryIntl(
        this.get('expression.caption'),
        `expressions.${this.get('expression.id')}`
      );
    }
  }),

  performLine: on('didRender', function() {
    const line = this.get('line');
    const options = line.options || {};

    if (this.get('fastboot')) {
      merge(options, { duration: 0 });
    }

    if (!this.element || this.get('previousLine') === line) { return; }

    this.set('previousLine', line);

    animate(this.element, line.effect, options).then(() => {
      if (line.resolve) { line.resolve(); }
    });
  })

});
