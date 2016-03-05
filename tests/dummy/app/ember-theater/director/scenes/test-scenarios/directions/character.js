import { Scene } from 'ember-theater/ember-theater/director';

export default Scene.extend({
  name: 'Character Direction Test',

  script: async function() {
    this.Character('bebe');

    await this.Pause('p');
    this.Character('bebe').transition({ opacity: 0.2 });

    await this.Pause('p');
    await this.Character('bebe').transition({ opacity: 0.3 }).transition({ opacity: 0.4 }).transition({ opacity: 0.5 });

    await this.Pause('p');
    await this.Character('bebe').instance(1).transition();

    await this.Pause('p');
    await this.Character('bebe').instance(1).transition({ opacity: 0.6 });

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
    await this.Character('bebe').instance(2).position('center');

    await this.Pause('p');
    await this.Character('bebe').instance(3).initialExpression('bebe-happy').position('center');

    await this.Pause('p');
    await this.Character('bebe').transition({ left: '30%' }, 10, { loop: true });
    this.Character('bebe').stop();
    await this.Pause('p');
  }
});
