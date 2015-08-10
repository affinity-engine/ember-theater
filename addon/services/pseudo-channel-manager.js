import Ember from 'ember';
import ModulePrefixMixin from 'ember-theater/mixins/ember-theater-module-prefix';

const {
  computed,
  on,
  Service
} = Ember;

export default Service.extend(ModulePrefixMixin, {
  createChannels: on('init', function() {
    const modulePrefix = this.get('_modulePrefix');

    this.get('directionNames').forEach((directionName) => {
      const direction = require(`${modulePrefix}/ember-theater-directions/${directionName}`)['default'];
      const pseudoChannels = direction.get('pseudoChannels')
      if (pseudoChannels) {
        pseudoChannels.forEach((pseudoChannel) => {
          if (this.get(pseudoChannel)) {
            this.get(pseudoChannel).pushObject(direction.get('componentType'));
          } else {
            const array = Ember.A([direction.get('componentType')]);
            this.set(pseudoChannel, array);
          }
        });
      }
    });
  }),

  directionNames: computed({
    get() {
      const paths = Object.keys(require.entries);
      const modulePrefix = this.get('_modulePrefix');
      const regex = new RegExp(`${modulePrefix}\/ember-theater-directions\/(.*)`);
      
      return paths.filter((path) => {
        return regex.test(path);
      }).map((path) => {
        return regex.exec(path)[1];
      }); 
    }
  })
});
