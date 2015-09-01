import Ember from 'ember';
import layout from './template';
import Director from 'ember-theater/components/ember-theater/director/component';
import DirectableComponentMixin from 'ember-theater/mixins/directable-component';
import VelocityLineMixin from 'ember-theater/mixins/velocity-line';
import WindowResizeMixin from 'ember-theater/mixins/window-resize';

const { 
  Component, 
  computed, 
  inject,
  on, 
  run 
} = Ember;
const { alias } = computed;

export default Component.extend(DirectableComponentMixin, VelocityLineMixin, WindowResizeMixin, {
  classNames: ['et-character'],
  layout: layout,
  expressionContainers: Ember.A([]),
  store: inject.service(),

  setCharacter: on('didInitAttrs', function() {
    const line = this.get('line');
    const character = this.get('store').peekRecord('ember-theater-character', line.id);

    this.set('character', character);
  }),

  activateImage() {
    const expression = this.$('.et-character-expression').first();

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
    const stage = this.nearestOfType(Director).$();

    this.set('stageWidth', stage.width());
    this.set('stageHeight', stage.height());
  }),

  // Uses JQuery `each`, which changes `this` to the current element. Therefore, no fat arrow.
  determineWidth(height) {
    let largestWidth = 0;

    this.$('.et-character-expression').each(function() {
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

  changeExpression: on('didRender', function() {
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

    if (!this.get('line.effect')) {
      transitionIn.resolve = this.get('line.resolve');
    }

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
