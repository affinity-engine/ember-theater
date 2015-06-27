import Scene from 'dummy/objects/scene';

export default Scene.create({
  script: [{
    backdrop: { id: 'beach', options: { duration: 0 } }
  }, {
    backdrop: { id: 'beach--night', options: { duration: 5000 } }
  }, {
    backdrop: { id: 'beach--night', options: { duration: 5000 }, effect: 'transition.fadeOut' }
  }]
});
