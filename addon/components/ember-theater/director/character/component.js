import Ember from 'ember';
import layout from './template';
import Director from 'ember-theater/components/ember-theater/director/component';
import DirectionComponentMixin from 'ember-theater/mixins/direction-component';
import VelocityLineMixin from 'ember-theater/mixins/velocity-line';
import WindowResizeMixin from 'ember-theater/mixins/window-resize';

const { 
  Component, 
  computed,
  get,
  inject,
  isBlank,
  isPresent,
  observer,
  on, 
  run,
  set 
} = Ember;

export default Component.extend(DirectionComponentMixin, VelocityLineMixin, WindowResizeMixin, {
  attributeBindings: ['style'],
  classNames: ['et-character'],
  layout: layout,

  store: inject.service(),

  expressionContainers: computed(() => Ember.A([])),

  setCharacter: on('didInitAttrs', function() {
    const characterId = get(this, 'line.id');
    const character = get(this, 'store').peekRecord('ember-theater-character', characterId);

    set(this, 'character', character);
  }),

  style: computed('character.height', {
    get() {
      const height = get(this, 'character.height');

      return `height: ${height}vh;`;
    }
  }).readOnly(),

  // during a window resize, the img dimensions get out of proportion. by forcing the browser
  // to redraw the element, we force it to also recalculate the ratios.
  handleWindowResize: on('windowResize', function() {
    this.$().css('display', 'none');

    run.later(() => {
      this.$().css('display', 'block');
    }, 25);
  }),

  perform: on('didInsertElement', observer('line', function() {
    const line = get(this, 'line');

    // by default, a line will 'transition.fadeIn' if it has no effect.
    // we do not want that to happen when there is an expression change.
    if (isPresent(get(line, 'effect')) || isBlank(get(line, 'expression'))) {
      this.executeLine();
    }
  })),

  watchForExpressionChange: observer('line', function() {
    const line = get(this, 'line.expression');

    if (isPresent(line)) {
      this.changeExpression(line);
    }
  }),

  addInitialExpression: on('didInsertElement', function() {
    let expression;

    if (this.get('line.expression.id')) {
      expression = this.get('store').peekRecord('ember-theater-character-expression', line.id); 
    } else {
      expression = this.get('character.defaultExpression');
    }

    const line = this.get('line.expression');
    const transitionIn = this.get('line.expression.transitionIn') ? line.transitionIn : { effect: 'fadeIn' };

    const expressionContainer = Ember.Object.create({
      expression: expression,
      line: transitionIn
    });

    this.get('expressionContainers').pushObject(expressionContainer);
  }),

  changeExpression(line) {
    const expression = this.get('store').peekRecord('ember-theater-character-expression', line.id); 
    const oldExpression = this.get('expressionContainers.firstObject');
    const transitionIn = line.transitionIn.effect ? line.transitionIn : { effect: 'fadeIn', options: line.transitionIn.options };
    const transitionOut = line.transitionOut.effect ? line.transitionOut : { effect: 'fadeOut', options: line.transitionOut.options };

    // remove the previous expression once it completes transitioning out
    transitionOut.resolve = () => {
      this.get('expressionContainers').removeObject(oldExpression);
    };

    oldExpression.set('line', transitionOut);

    // let the transition in resolve the line if there is no primary line effect
    if (isBlank(this.get('line.effect'))) {
      transitionIn.resolve = this.get('line.resolve');
    }

    const expressionContainer = Ember.Object.create({
      line: transitionIn, 
      expression: expression
    });

    this.get('expressionContainers').pushObject(expressionContainer);
  }
});
