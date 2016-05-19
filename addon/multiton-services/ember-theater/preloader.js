import Ember from 'ember';
import { MultitonService } from 'ember-multiton-service';
import { MultitonIdsMixin } from 'ember-theater';

const {
  get,
  on,
  set
} = Ember;

export default MultitonService.extend(MultitonIdsMixin, {
  initializeQueue: on('init', function() {
    const queue = new createjs.LoadQueue(true);

    queue.installPlugin(createjs.Sound);
    set(this, 'queue', queue);
  }),

  idFor(fixture, attribute) {
    return `${fixture._type}:${fixture.id}:${attribute}`;
  },

  getElement(id) {
    return get(this, 'queue').getResult(id);
  },

  loadFile(file) {
    get(this, 'queue').loadFile(file);
  },

  onComplete(callback) {
    get(this, 'queue').on('complete', callback);
  },

  onFileLoad(callback) {
    get(this, 'queue').on('fileload', callback);
  },

  onProgress(callback) {
    get(this, 'queue').on('progress', callback);
  }
});
