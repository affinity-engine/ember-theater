import Ember from 'ember';
import layout from './template';
import DirectableComponentMixin from 'ember-theater/mixins/directable-component';
import PerfectScrollbarMixin from 'ember-theater/mixins/perfect-scrollbar';
import WindowResizeMixin from 'ember-theater/mixins/window-resize';

const {
  Component,
  computed,
  inject,
  on
} = Ember;

export default Component.extend(DirectableComponentMixin, PerfectScrollbarMixin, WindowResizeMixin, {
  classNameBindings: ['line.class'],
  classNames: ['et-choice'],
  intlWrapper: inject.service(),
  layout: layout,

  choices: computed('line.choices', 'line.intl.choices', {
    get() {
      const intlChoices = this.get('line.intl.choices');
      const choices = intlChoices ? intlChoices : this.get('line.choices');
      const keys = Object.keys(choices);

      return keys.map((key) => {
        const text = this.get('intlWrapper').tryIntl(choices[key], choices[key]);

        return { path: key, text: text };
      });
    }
  }).readOnly(),

  header: computed('line.header', 'line.intl.header', {
    get() {
      return this.get('intlWrapper').tryIntl(
        this.get('line.header'),
        this.get('line.intl.header')
      );
    }
  }).readOnly(),

  actions: {
    choose(path) {
      Ember.$.Velocity.animate(this.element, { opacity: 0 }, { duration: 100 }).then(() => {
        this.get('line.resolve')(path);
        this.attrs.destroyDirectable();
      });
    }
  }
});
