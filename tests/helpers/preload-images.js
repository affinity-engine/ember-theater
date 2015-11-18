import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Test.registerAsyncHelper('preloadImages', function() {
  return new Ember.RSVP.Promise(function(resolve) {

    let loadedImages = 0;

    const checkForLoadCompletion = () => {
      loadedImages += 1;
      if (loadedImages >= config.imageSrcs.length) {
        resolve();
      }
    };

    Ember.run(() => {
      config.imageSrcs.forEach((src) => {
        const image = new Image();

        image.src = `images/${src}`;
        image.onload = function() {
          checkForLoadCompletion();
        };
      });
    });
  });
});
