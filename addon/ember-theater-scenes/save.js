import Ember from 'ember';
import Scene from 'ember-theater/models/ember-theater-scene';

const {
  inject
} = Ember;

export default Scene.extend({
  session: inject.service(),

  script(director) {
    const autosave = this.get('session.autosave');
    const nextSceneId = this.get('options.nextSceneId');

    this.get('session').updateAutosave(nextSceneId);
    this.saveChoice(director);
  },

  persistSave(save) {
    this.get('session').persistSave(save);
  },

  saveChoice: async function(director) {
    const nextSceneId = this.get('options.nextSceneId');
    const session = this.get('session');
    const saves = session.get('saves');
    const choices = { 
      done74923: { class: 'et-choice-close', icon: 'arrow-right', text: 'ember-theater.save.done' },
      newSave74923: { icon: 'save', text: 'ember-theater.save.newGame', inputable: true }
    };
    
    saves.forEach((save) => {
      if (save.name !== 'autosave') { choices[save.name] = { text: save.name, object: save }; }
    });

    const choice = await director.choice({ header: 'ember-theater.save.header', choices: choices });

    switch (choice.key) {
      case 'done74923': return director.transitionToScene(nextSceneId);
      case 'newSave74923': session.createSave(choice.input); break;
      default: this.persistSave(choice.object);
    }

    this.saveChoice(director); 
  }
});
