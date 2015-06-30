import Scene from 'dummy/objects/scene';

export default Scene.create({
  script: [{
    backdrop: { id: 'beach', options: { duration: 0 } }
  }, {
    character: { id: 'steven', effect: { translateX: '50vw', opacity: 1 }, options: { duration: 500 }, sync: true }
  }, {
    character: { id: 'steven', effect: { rotateY: '180deg', translateZ: '100vh' }, options: { duration: 500 }, sync: true }
  }, {
    backdrop: { id: 'beach--night', options: { duration: 5000 }, sync: true }
  }, {
    pause: { keyPress: true } 
  }, {
    backdrop: { id: 'beach--night', options: { duration: 5000 }, effect: 'transition.fadeOut' }
  }]
});
