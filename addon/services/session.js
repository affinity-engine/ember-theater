import Ember from 'ember';

const {
  computed,
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
    const save = this.get('db').getCollection('saves').insert({ name: name, savePoints: [] });
    this.persistSave(save);
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
    db.loadDatabase({}, () => {
      let autosave, currentState, saveCollection;

      saveCollection = db.getCollection('saves');

      if (saveCollection) {
        autosave = saveCollection.findOne({ name: 'autosave' });
        currentState = autosave.savePoints[0].data;
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

  loadGame(game) {
    const currentState = game.savePoints[0].data;

    this.setProperties({
      autosave: game,
      currentState
    });
  },

  persistAutosave() {
    this.persistSave(this.get('autosave'));
  },

  persistSave(save, sceneId) {
    const {
      currentState,
      db,
      saveCollection
    } = this.getProperties('currentState', 'db', 'saveCollection');

    save.savePoints.unshift({ sceneId: sceneId, data: currentState });
    saveCollection.update(save);
    db.saveDatabase();
  },

  refreshAutosave() {
    const currentState = {};
    const autosave = this.get('autosave');
    const saveCollection = this.get('saveCollection');

    autosave.savePoints = [];
    autosave.sceneId = '';
    saveCollection.update(autosave);
    db.saveDatabase();

    this.setProperties({
      autosave,
      currentState
    });
  },

  saves: computed('saveCollection', {
    get() {
      return this.get('saveCollection').find();
    }
  }).readOnly()
});
