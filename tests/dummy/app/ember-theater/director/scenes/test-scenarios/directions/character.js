import { Scene } from 'ember-theater/ember-theater/director';

export default Scene.extend({
  name: 'Character Direction Test',

  script: async function() {
    const bebe = this.Character('bebe');

    await this.Pause('p');
    bebe.transition({ opacity: 0.2 });

    await this.Pause('p');
    await bebe.transition({ opacity: 0.3 }).transition({ opacity: 0.4 }).transition({ opacity: 0.5 });

    await this.Pause('p');
    const bebe2 = await this.Character('bebe').transition();

    await this.Pause('p');
    await bebe2.transition({ opacity: 0.6 });

    await this.Pause('p');
    await this.Character('blixie').transition();

    await this.Pause('p');
    await this.Character({
      id: 'bobo',
      name: 'Bobo',
      height: 90,
      defaultExpressionId: 'blixie-neutral'
    }).transition();

    await this.Pause('p');
    const bebe3 = await this.Character('bebe').position('center');

    await this.Pause('p');
    await bebe3.position('left low');

    await this.Pause('p');
    await this.Character('bebe').initialExpression('bebe-happy').position('center');

    await this.Pause('p');
    await bebe.transition({ left: '30%' }, 10, { loop: true });
    bebe.stop();
    await this.Pause('p');
  }
});
