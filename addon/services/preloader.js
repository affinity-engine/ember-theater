import Ember from 'ember';

const {
  Service,
  get,
  on,
  set
} = Ember;

export default Service.extend({
  initializeQueue: on('init', function() {
    const queue = new createjs.LoadQueue(true);

    queue.installPlugin(createjs.Sound);
    set(this, 'queue', queue);
  }),

  idFor(model, attribute) {
    return `${model.constructor.modelName}:${model.id}:${attribute}`;
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
