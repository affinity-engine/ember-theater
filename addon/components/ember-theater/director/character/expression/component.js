import Ember from 'ember';

const { 
  Component, 
  computed,
  inject,
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

    if (!this.element || this.get('previousLine') === line) { return; }
    
    this.set('previousLine', line);

    Ember.$.Velocity.animate(this.element, line.effect, line.options).then(() => {
      if (line.resolve) { line.resolve(); }
    });
  })

});
