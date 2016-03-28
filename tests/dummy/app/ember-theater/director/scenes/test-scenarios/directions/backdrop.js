import { Scene } from 'ember-theater/ember-theater/director';

export default Scene.extend({
  name: 'Backdrop Direction Test',

  start: async function(script) {
    const classroom = script.Backdrop('classroom');

    await script.Delay('p');
    classroom.transition({ opacity: 0.2 });

    await script.Delay('p');
    await classroom.transition({ opacity: 0.3 }).transition({ opacity: 0.4 }).transition({ opacity: 0.5 });

    await script.Delay('p');
    classroom.caption('foo');

    await script.Delay('p');
    const classroom2 = await script.Backdrop('classroom').transition({ opacity: 0.8 });

    await script.Delay('p');
    await classroom2.transition({ opacity: 0.6 });

    await script.Delay('p');
    await script.Backdrop('beach-day');

    await script.Delay('p');
    await script.Backdrop({
      id: 'beach-night',
      caption: 'beach during the night',
      src: 'theater/backdrops/beach-night.jpg'
    });
  }
});
