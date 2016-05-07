import Ember from 'ember';
import layout from './template';
import DirectableComponentMixin from 'ember-theater/mixins/ember-theater/director/directable-component';
import TransitionMixin from 'ember-theater/mixins/ember-theater/director/transition';
import configurable, { deepConfigurable } from 'ember-theater/macros/ember-theater/configurable';
import multiton from 'ember-multiton-service';

const {
  Component,
  computed,
  get,
  isPresent,
  on,
  set
} = Ember;

const configurablePriority = ['directable.attrs', 'config.attrs.director.codeChallenge', 'config.attrs.globals'];

export default Component.extend(DirectableComponentMixin, TransitionMixin, {
  layout,

  config: multiton('ember-theater/config', 'theaterId'),

  rawSnippets: configurable(configurablePriority, 'snippets'),
  transitionIn: deepConfigurable(configurablePriority, 'transitionIn'),
  transitionOut: deepConfigurable(configurablePriority, 'transitionOut'),

  handlePriorSceneRecord: on('didInsertElement', function() {
    if (isPresent(get(this, 'priorSceneRecord'))) {
      set(this, 'directable.direction.result', get(this, 'priorSceneRecord'));

      this.resolveAndDestroy();
    }
  }),

  transitionInCodeChallenge: on('didInsertElement', function() {
    this.executeTransitionIn();
  }),

  snippets: computed('rawSnippets', {
    get() {
      const snippets = get(this, 'rawSnippets');

      set(snippets.find((snippet) => get(snippet, 'readOnly') !== true), 'autofocus', true);

      snippets.forEach((snippet) => {
        if (get(snippet, 'readOnly')) {
          set(snippet, 'classNames', ['et-code-challenge-readOnly']);
        }
      });

      return snippets;
    }
  }),

  actions: {
    valueUpdated(snippet, index) {
      const snippets = get(this, 'snippets');

      set(snippets[index], 'code', get(snippet, 'code'));
    },

    complete() {
      let result;
      let isValid = true;

      try {
        const code = get(this, 'snippets').map((snippet) => get(snippet, 'code')).join(' ');
        const encapsulatedCode = `function userGeneratedCode() { ${code} }; userGeneratedCode();`;
        const transpiledCode = Babel.transform(encapsulatedCode, { presets: ['es2015'] }).code;

        result = eval(transpiledCode);
      } catch (exception) {
        set(this, 'exception', exception);
        isValid = false;
      }

      if (isValid) {
        set(this, 'directable.direction.result', result);

        this.executeTransitionIn().then(() => {
          this.resolveAndDestroy();
        });
      }
    }
  }
});
