import Ember from 'ember';
import layout from './template';
import Director from 'ember-theater/components/ember-theater/director/component';
import DirectableComponentMixin from 'ember-theater/mixins/directable-component';
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
  set,
  typeOf
} = Ember;
const { run: { later } } = Ember;

export default Component.extend(DirectableComponentMixin, VelocityLineMixin, WindowResizeMixin, {
  attributeBindings: ['style'],
  classNames: ['et-character'],
  layout: layout,

  store: inject.service(),

  expressionContainers: computed(() => Ember.A([])),

  changeExpression(resolve, id, transitionIn = {}, transitionOut = {}) {
    this._transitionOutExpressions(transitionOut);
    this._transitionInExpression(resolve, id, transitionIn);
  },

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

    later(() => {
      this.$().css('display', 'block');
    }, 25);
  }),

  setCharacter: on('didInitAttrs', function() {
    const id = get(this, 'directable.id');
    const character = get(this, 'store').peekRecord('ember-theater-character', id);

    set(this, 'character', character);
  }),

  addInitialExpression: on('didInsertElement', function() {
    const directable = get(this, 'directable');
    const expressionId = get(directable, 'character.expression');
    const expression = isPresent(expressionId) ?
      get(this, 'store').peekRecord('ember-theater-character-expression', expressionId) :
      get(this, 'character.defaultExpression');

    const expressionContainer = Ember.Object.create({
      expression,
      directable: { effect: 'transition.fadeIn', options: { duration: 0 } }
    });

    this.get('expressionContainers').pushObject(expressionContainer);
  }),

  _transitionOutExpressions(transition) {
    const expression = get(this, 'expressionContainers.firstObject');

    if (isBlank(get(transition, 'effect'))) {
      set(transition, 'effect', 'transition.fadeOut');
    }
    
    set(transition, 'resolve', () => {
      get(this, 'expressionContainers').removeObjects(expression);
    });
   
    set(expression, 'directable', transition);
  },

  _transitionInExpression(resolve, id, transition) {
    const expression = get(this, 'store').peekRecord('ember-theater-character-expression', id);

    if (isBlank(get(transition, 'effect'))) {
      set(transition, 'effect', 'transition.fadeIn');
    }

    set(transition, 'resolve', resolve);

    const expressionContainer = Ember.Object.create({
      expression,
      directable: transition
    });

    get(this, 'expressionContainers').unshiftObject(expressionContainer);
  }
});
