import Ember from 'ember';
import layout from './template';
import DirectionComponentMixin from 'ember-theater/mixins/direction-component';
import PerfectScrollbarMixin from 'ember-theater/mixins/perfect-scrollbar';
import WindowResizeMixin from 'ember-theater/mixins/window-resize';

const {
  Component,
  computed,
  inject,
  merge
} = Ember;

export default Component.extend(DirectionComponentMixin, PerfectScrollbarMixin, WindowResizeMixin, {
  classNameBindings: ['line.class'],
  classNames: ['et-choice'],
  intlWrapper: inject.service(),
  layout: layout,

  choices: computed('line.choices', {
    get() {
      const choices = this.get('line.choices');
      const keys = Object.keys(choices);

      return keys.map((key) => {
        const value = choices[key];
        const text = this.get('intlWrapper').tryIntl(value, value);

        return merge({
          input: '',
          key,
          text
        }, choices[key]);
      });
    }
  }).readOnly(),

  header: computed('line.header', {
    get() {
      const header = this.get('line.header');

      return this.get('intlWrapper').tryIntl(
        header,
        header
      );
    }
  }).readOnly(),

  actions: {
    choose(choice) {
      Ember.$.Velocity.animate(this.element, { opacity: 0 }, { duration: 100 }).then(() => {
        this.get('line.resolve')(choice);
        this.attrs.destroyDirection();
      });
    }
  }
});
