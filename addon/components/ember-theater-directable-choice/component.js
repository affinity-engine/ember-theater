import Ember from 'ember';
import layout from './template';
import DirectableComponentMixin from '../../mixins/directable-component';
import PerfectScrollbarMixin from '../../mixins/perfect-scrollbar';
import WindowResizeMixin from '../../mixins/window-resize';

const {
  Component,
  computed,
  inject,
  on
} = Ember;

export default Component.extend(DirectableComponentMixin, PerfectScrollbarMixin, WindowResizeMixin, {
  classNameBindings: ['line.class'],
  classNames: ['ember-theater-stage__choice'],
  intlWrapper: inject.service(),
  layout: layout,

  choices: computed('line.choices', 'line.intl.choices', {
    get() {
      const intlChoices = this.get('line.intl.choices');
      const choices = intlChoices ? intlChoices : this.get('line.choices');
      const keys = Object.keys(choices);

      return keys.map((key) => {
        let text;

        if (intlChoices) {
          const intlKey = choices[key].id ? choices[key].id : choices[key];
          text = this.get('intlWrapper').formatMessage(intlKey, choices[key].options);
        } else {
          text = choices[key];
        }

        return { path: key, text: text };
      });
    }
  }).readOnly(),

  header: computed('line.header', 'line.intl.header', {
    get() {
      const intlHeader = this.get('line.intl.header');

      if (intlHeader) {
        const intlKey = intlHeader.id ? intlHeader.id : intlHeader;
        return this.get('intlWrapper').formatMessage(intlKey, intlHeader.options);
      }

      return this.get('line.header');
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
