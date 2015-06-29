import Scene from 'dummy/objects/scene';

export default Scene.create({
  script: [{
    backdrop: { id: 'beach', options: { duration: 0 } }
  }, {
    character: { id: 'steven', effect: { position: ['center', 'center'], opacity: 1 }, options: { duration: 200 }, sync: true }
  }, {
    character: { id: 'steven', effect: { translateZ: '-100vh', rotateY: '-180deg' }, options: { duration: 4000 } }
  }, {
    backdrop: { id: 'beach--night', options: { duration: 5000 }, sync: true }
  }, {
    pause: { keyPress: true } 
  }, {
    backdrop: { id: 'beach--night', options: { duration: 5000 }, effect: 'transition.fadeOut' }
  }]
});
