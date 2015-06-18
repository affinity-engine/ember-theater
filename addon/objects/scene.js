import Ember from 'ember';

const { ControllerMixin, computed, inject, run } = Ember;

export default Ember.Object.extend(ControllerMixin, {
  store: inject.service('store'),
  _lineIndex: 0,

  _line: computed('_lineIndex', {
    get() {
      return this.get('script')[this.get('_lineIndex')];
    }
  }),

  _lineKey: computed('_line', {
    get() {
      return Object.keys(this.get('_line'))[0];
    }
  }),

  _lineValue: computed('_line', '_lineKey', {
    get() {
      return this.get('_line')[this.get('_lineKey')];
    }
  }),

  _nextLineExists: computed('_lineIndex', 'script.length', {
    get() {
      return this.get('_lineIndex') < this.get('script.length') - 1;
    }
  }),

  _actions: {
    backdrop(line) {
      this.get('store').find('ember-theater-backdrop', line.id).then((backdrop) => {
        this.set('director.backdrop', backdrop);
      }); 
    },

    next() {
      this.send(this.get('_lineKey'), this.get('_lineValue'));

      if (this.get('_nextLineExists')) {
        this.incrementProperty('_lineIndex');
        const pause = this.get('_lineValue.pause');
        if (pause !== true) {
          run.later(() => {
            this.send('next');
          }, pause);
        }
      }
    }
  }
});
