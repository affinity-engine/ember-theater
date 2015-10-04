import Ember from 'ember';

const {
  computed,
  inject,
  isPresent,
  on,
  Service
} = Ember;

export default Service.extend({
  emberTheaterSceneManager: inject.service(),

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
      let autosave, currentState, initialSceneId, saveCollection;

      saveCollection = db.getCollection('saves');

      if (saveCollection) {
        autosave = saveCollection.findOne({ name: 'autosave' });
        currentState = autosave.savePoints[0].data;
      } else {
        initialSceneId = this.get('emberTheaterSceneManager.initialSceneId');
        saveCollection = db.addCollection('saves', { indices: ['name'] });
        autosave = saveCollection.insert({ initialSceneId, name: 'autosave', savePoints: [] });
        currentState = {};
      }

      this.setProperties({
        autosave,
        currentState,
        db,
        saveCollection
      });

      if (isPresent(initialSceneId)) {
        this.updateAutosave(initialSceneId);
      }
    });
  }),

  loadGame(game) {
    const currentState = game.savePoints[0].data;

    this.setProperties({
      autosave: game,
      currentState
    });
  },

  updateAutosave(sceneId) {
    const {
      autosave,
      currentState
    } = this.getProperties('autosave', 'currentState');

    const savePoints = Ember.$.extend([], autosave.savePoints);
    const data = Ember.$.extend({}, currentState);
    
    savePoints.unshift({ sceneId: sceneId, data: data });
    autosave.savePoints = savePoints;

    this.set('autosave', autosave);
    this.persistSave(autosave);
  },

  persistSave(save) {
     const {
      autosave,
      db,
      saveCollection
    } = this.getProperties('autosave', 'db', 'saveCollection');
    
    const savePoints = Ember.$.extend([], autosave.savePoints);
    save.savePoints = savePoints;

    saveCollection.update(save);
    db.saveDatabase();
  },

  refreshAutosave() {
    const {
      autosave,
      db,
      saveCollection
    } = this.getProperties('autosave', 'db', 'saveCollection');
    const currentState = {};
    const initialSceneId = this.get('emberTheaterSceneManager.initialSceneId');

    autosave.savePoints = [];
    autosave.sceneId = initialSceneId;
    saveCollection.update(autosave);
    db.saveDatabase();

    this.setProperties({
      autosave,
      currentState
    });

    this.updateAutosave(initialSceneId);
  },

  saves: computed('saveCollection', {
    get() {
      return this.get('saveCollection').find();
    }
  }).readOnly()
});
