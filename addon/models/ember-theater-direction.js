import Ember from 'ember';

const {
  isBlank,
  isPresent,
  on,
  tryInvoke
} = Ember;

export default Ember.Object.extend({
  handleDirection: on('init', function() {
    if (isPresent('componentType')) {
      this._requestComponentManagement();
    }

    tryInvoke(this, 'perform');
  }),
  
  _requestComponentManagement() { 
    const scene = this.get('scene');

    scene.clearChannels(this.get('channels'));
    scene.pushDirectable(this);
  }
});
