import Scene from 'ember-theater/models/ember-theater-scene';

export default Scene.create({
  script: [{
    backdrop: { id: 'beach', options: { duration: 0 } }
  }, {
    character: { id: 'steven', effect: { translateX: '50vw', opacity: 1 }, options: { duration: 500 }, sync: true }
  }, {
    character: { id: 'steven', expression: { id: 'steven--jumping', transitionOut: { effect: 'transition.whirlOut', options: { duration: 1000 } }, transitionIn: { effect: 'transition.whirlIn', options: { duration: 1000 } } } }
  }, {
    backdrop: { id: 'beach--night', options: { duration: 1000 }, sync: true }
  }, {
    pause: { keyPress: true } 
  }, {
    backdrop: { id: 'beach--night', options: { duration: 5000 }, effect: 'transition.fadeOut' }
  }]
});
