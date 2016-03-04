import { Scene } from 'ember-theater/ember-theater/director';

export default Scene.extend({
  name: 'Backdrop Direction Test',

  script: async function() {
    this.Backdrop('classroom');

    await this.Pause('p');
    this.Backdrop('classroom').transition({ opacity: 0.2 });

    await this.Pause('p');
    await this.Backdrop('classroom').transition({ opacity: 0.3 }).transition({ opacity: 0.4 }).transition({ opacity: 0.5 });

    await this.Pause('p');
    await this.Backdrop('classroom').caption('foo');

    await this.Pause('p');
    await this.Backdrop('classroom').instance(1);

    await this.Pause('p');
    await this.Backdrop('classroom').instance(1).transition({ opacity: 0.6 });

    await this.Pause('p');
    await this.Backdrop('beach-day');

    await this.Pause('p');
    await this.Backdrop({
      id: 'beach-night',
      caption: 'beach during the night',
      src: 'theater/backdrops/beach-night.jpg'
    });
  }
});
