import { Scene } from 'ember-theater/ember-theater/director';
import step from 'ember-theater/ember-theater/director/test-support/step';

export default Scene.extend({
  name: 'Backdrop Direction Test',

  start: async function(script) {
    const classroom = script.Backdrop('classroom');

    await step(script);
    classroom.transition({ opacity: 0.2 });

    await step(script);
    await classroom.transition({ opacity: 0.3 }).transition({ opacity: 0.4 }).transition({ opacity: 0.5 });

    await step(script);
    classroom.caption('foo');

    await step(script);
    const classroom2 = await script.Backdrop('classroom').transition({ opacity: 0.8 });

    await step(script);
    await classroom2.transition({ opacity: 0.6 });

    await step(script);
    await script.Backdrop('beach-day');

    await step(script);
    await script.Backdrop({
      id: 'beach-night',
      caption: 'beach during the night',
      src: 'theater/backdrops/beach-night.jpg'
    });
  }
});
