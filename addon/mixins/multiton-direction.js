import Ember from 'ember';

const { 
  inject, 
  Mixin 
} = Ember;

export default Mixin.create({
  store: inject.service(),

  direct(line, directables) {
    if (line.destroy) { 
      this._alterDirectable(directables, line.id, (container) => {
        directables.removeObject(container);
      });

      return line.sync = false; 
    }

    if (!directables.isAny('line.id', line.id)) { 
      const directable = Ember.Object.create({
        componentType: this.get('componentType'),
        line: line
      });

      directables.pushObject(directable); 
    } else {
      this._alterDirectable(directables, line.id, (container) => {
        container.set('line', line);
      });
    }
  },

  _alterDirectable(directables, id, callback) {
    const container = directables.find((container) => {
      return container.get('line.id') === id;
    });

    callback(container);
  }
});
