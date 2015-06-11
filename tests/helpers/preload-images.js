import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Test.registerAsyncHelper('preloadImages', function(app) {
  return new Ember.RSVP.Promise(function(resolve) {

    var loadedImages = 0;

    var checkForLoadCompletion = function() {
      loadedImages += 1;
      if (loadedImages >= config.imageSrcs.length) {
        resolve();
      }
    };

    Ember.run(function() {
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
