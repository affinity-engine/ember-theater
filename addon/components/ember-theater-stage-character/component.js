import Ember from 'ember';
import layout from './template';
import TheaterStage from '../ember-theater-stage/component';
import WindowResizeMixin from '../../mixins/window-resize';
import PerformableLineMixin from '../../mixins/performable-line';

const { 
  Component, 
  computed, 
  inject,
  observer,
  on, 
  run 
} = Ember;
const { alias } = computed;

export default Component.extend(WindowResizeMixin, PerformableLineMixin, {
  classNames: ['ember-theater-stage__character'],
  layout: layout,
  expressionContainers: Ember.A([]),
  store: inject.service(),

  setCharacter: on('didInitAttrs', function() {
    const line = this.get('line');
    const character = this.get('store').peekRecord('ember-theater-character', line.id);

    this.set('character', character);
  }),

  activateImage() {
    const expression = this.$('.ember-theater-stage__expression').first();

    return Ember.$.Velocity.animate(expression, {
      opacity: 100
    }, 0);
  },

  addInitialExpression: on('didInsertElement', function() {
    let expression;
    const line = this.get('line.expression');
    const transitionIn = this.get('line.expression.transitionIn') ? line.transitionIn : { effect: { opacity: 1 } };

    if (this.get('line.expression.id')) {
      expression = this.get('store').peekRecord('ember-theater-character-expression', line.id); 
    } else {
      expression = this.get('character.defaultExpression');
    }

    const expressionContainer = Ember.Object.create({
      expression: expression,
      line: transitionIn
    });
    const height = this.get('character.height');

    this.$().height(`${height}vh`);
    this.get('expressionContainers').pushObject(expressionContainer);

    run.later(() => {
      this.adjustImageSizes();
    });
  }),

  adjustImageSizes() {
    const height = this.get('character.height');
    const stageHeight = this.get('stageHeight');
    const largestWidth = this.determineWidth(height * stageHeight / 100);

    this.$().width(largestWidth).css('left', largestWidth - (largestWidth * 1.5));
  },

  adjustStageSize: on('didInsertElement', function() {
    const stage = this.nearestOfType(TheaterStage).$();

    this.set('stageWidth', stage.width());
    this.set('stageHeight', stage.height());
  }),

  // Uses JQuery `each`, which changes `this` to the current element. Therefore, no fat arrow.
  determineWidth(height) {
    let largestWidth = 0;

    this.$('.ember-theater-stage__expression').each(function() {
      const $img = Ember.$(this);
      const width = $img.prop('naturalWidth') * height / $img.prop('naturalHeight');

      if (width > largestWidth) {
        largestWidth = width;
      }

      $img.width(width);
    });

    return largestWidth;
  },

  handleWindowResize: on('windowResize', function() {
    this.adjustStageSize();
    this.adjustImageSizes();
  }),

  performLine: on('didUpdate', function() {
    this.executeLine();
  }),

  changeExpression: observer('line.expression', function() {
    const line = this.get('line.expression');
    if (!line || !this.element || this.get('previousExpressionLine') === line) { return; }
    
    this.set('previousExpressionLine', line);

    const expression = this.get('store').peekRecord('ember-theater-character-expression', line.id); 
    const oldExpression = this.get('expressionContainers.firstObject');
    const transitionIn = line.transitionIn.effect ? line.transitionIn : { effect: 'fadeIn', options: line.transitionIn.options };
    const transitionOut = line.transitionOut.effect ? line.transitionOut : { effect: 'fadeOut', options: line.transitionOut.options };

    transitionOut.resolve = () => {
      this.get('expressionContainers').removeObject(oldExpression);
    };

    const expressionContainer = Ember.Object.create({
      line: transitionIn, 
      expression: expression
    });

    oldExpression.set('line', transitionOut);
    this.get('expressionContainers').pushObject(expressionContainer);
 
    run.later(() => {
      this.adjustImageSizes();
    });
  })
});
