import Ember from 'ember';

const { 
  Component, 
  computed,
  on 
} = Ember;

const { alias } = computed;

export default Component.extend({
  attributeBindings: ['src'],
  classNames: ['ember-theater-stage__expression'],
  previousLine: null,
  src: alias('expression.src'),
  tagName: 'img',

  performLine: on('didRender', function() {
    const line = this.get('line');

    if (!this.element || this.get('previousLine') === line) { return; }
    
    this.set('previousLine', line);

    Ember.$.Velocity.animate(this.element, line.effect, line.options).then(() => {
      if (line.resolve) { line.resolve(); }
    });
  })

});
