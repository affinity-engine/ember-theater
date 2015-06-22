import Scene from 'dummy/objects/scene';

export default Scene.create({
  script: [{
    backdrop: { id: 'beach', options: { duration: 0 } }
  }, {
    backdrop: { id: 'beach', options: { duration: 1000 }, effect: 'callout.tada' }
  }]
});
