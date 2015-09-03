import Ember from 'ember';

const {
  computed,
  copy,
  on,
  Service
} = Ember;

export default Service.extend({
  getCurrentSessionItem(key) {
    return this.get(`currentState.${key}`);
  },
  
  setCurrentSessionItem(key, value) {
    const currentState = this.get('currentState');
    currentState[key] = value;
  },

  removeCurrentSessionItem(key) {
    delete this.get('currentState')[key];
  },

  createSave(name) {
    const save = this.get('saves').insert({ name: name, savePoints: [] });
    persistSave(save);
  },

  deleteGame(save) {
    const {
      db,
      saveCollection
    } = this.getProperties('db', 'saveCollection');

    saveCollection.remove(save);
    db.saveDatabase();
  },

  getSavesFromLocalStorage: on('init', function() {
    const db = new loki('game');
    db.loadDatabase({}, (results) => {
      let autosave, currentState, saveCollection;

      saveCollection = db.getCollection('saves');

      if (saveCollection) {
        autosave = saveCollection.findOne({ name: 'autosave' });
        currentState = autosave.savePoints[autosave.savePoints.length - 1].data;
      } else {
        saveCollection = db.addCollection('saves', { indices: ['name'] });
        autosave = saveCollection.insert({ name: 'autosave', savePoints: [] });
        currentState = {};
      }

      this.setProperties({
        autosave,
        currentState,
        db,
        saveCollection
      });
    });
  }),

  persistAutosave() {
    this.persistSave(this.get('autosave'));
  },

  persistSave(save, sceneId) {
    const {
      currentState,
      db,
      saveCollection
    } = this.getProperties('currentState', 'db', 'saveCollection');

    save.savePoints.push({ sceneId: sceneId, data: currentState });
    saveCollection.update(save);
    db.saveDatabase();
  },

  saves: computed('saveCollection', {
    get() {
      return this.get('saveCollection').find();
    }
  }).readOnly()
});
