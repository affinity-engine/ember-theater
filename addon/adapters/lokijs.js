import DS from 'ember-data';
import Ember from 'ember';

const {
  isPresent,
  on
} = Ember;

const { Adapter } = DS;
const { RSVP: { resolve } } = Ember;

export default Adapter.extend({
  indices: [],

  initializeDb: on('init', function() {
    const db = new loki('ember-lokijs');

    db.loadDatabase();

    this.set('db', db);
  }),

  createRecord(store, type, snapshot) {
    const serializedData = store.serializerFor(type.modelName).serialize(snapshot);
    const record = this._findOrAddCollection(type).insert(serializedData);

    this._saveDatabase();

    return this._promiseWrap(record);
  },

  updateRecord(store, type, snapshot) {
    const serializedData = store.serializerFor(type.modelName).serialize(snapshot);
    const record = this._findOrAddCollection(type).update(serializedData);

    this._saveDatabase();

    return this._promiseWrap(record);
  },

  deleteRecord(store, type, snapshot) {
    const serializedData = store.serializerFor(type.modelName).serialize(snapshot);
    this._findOrAddCollection(type).remove(serializedData);
    this._saveDatabase();

    return resolve(null);
  },

  findAll(store, type) {
    const collection = this._findOrAddCollection(type).find();

    return this._promiseWrap(collection);
  },

  findRecord(store, type, id) {
    const record = this._findOrAddCollection(type).get(id);

    return this._promiseWrap(record);
  },

  query(store, type, query) {
    const collection = this._findOrAddCollection(type).find(query);

    return this._promiseWrap(collection);
  },

  queryRecord(store, type, query) {
    const record = this._findOrAddCollection(type).findOne(query);

    return this._promiseWrap(record);
  },

  _findOrAddCollection(type) {
    const {
      db,
      indices
    } = this.getProperties('db', 'indices');

    let collection = db.getCollection(type.modelName);

    if (!collection) {
      collection = db.addCollection(type.modelName, {
        indices
      });
    }

    return collection;
  },

  _promiseWrap(records) {
    const data = isPresent(records) ? records : [];

    return resolve(data);
  },

  _saveDatabase() {
    this.get('db').saveDatabase();
  }
});
