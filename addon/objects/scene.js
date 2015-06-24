import Ember from 'ember';

const { ControllerMixin, RSVP, computed } = Ember;

export default Ember.Object.extend(ControllerMixin, {
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
    next() {
      const promise = new RSVP.Promise((resolve) => {
        this.get('director').send(this.get('_lineKey'), this.get('_lineValue'), resolve);
      });

      promise.then(() => {
        if (this.get('_nextLineExists')) {
          this.incrementProperty('_lineIndex');
          this.send('next');
        } 
      });
    }
  }
});
