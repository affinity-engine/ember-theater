import Ember from 'ember';

const { 
  computed, 
  Service 
} = Ember;

export default Service.extend({
  _lineIndex: -1,

  nextLine() {
    if (!this.get('_nextLineExists')) { return { action: false }; }
    this.incrementProperty('_lineIndex');
    return { action: this.get('_lineKey'), line: this.get('_lineValue') };
  },

  _line: computed('_lineIndex', {
    get() {
      return this.get('scene.script')[this.get('_lineIndex')];
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

  _nextLineExists: computed('_lineIndex', 'scene.script.length', {
    get() {
      return this.get('_lineIndex') < this.get('scene.script.length') - 1;
    }
  })
});
