import { Scene } from 'ember-theater/ember-theater/director';
import step from 'ember-theater/ember-theater/test-support/step';

export default Scene.extend({
  name: 'Character Direction Test',

  start: async function(script) {
    const bebe = script.Character('bebe');

    await step(script);
    bebe.transition({ opacity: 0.2 });

    await step(script);
    await bebe.transition({ opacity: 0.3 }).transition({ opacity: 0.4 }).transition({ opacity: 0.5 });

    await step(script);
    const bebe2 = await script.Character('bebe');

    await step(script);
    await bebe2.transition({ opacity: 0.6 });

    await step(script);
    await script.Character('blixie');

    await step(script);
    await script.Character({
      id: 'bobo',
      name: 'Bobo',
      height: 90,
      defaultExpression: 'blixie-neutral'
    });

    await step(script);
    const bebe3 = await script.Character('bebe').position('center');

    await step(script);
    await bebe3.position('left nudgeDown');

    await step(script);
    await script.Character('bebe').initialExpression('bebe-happy').position('center');
  }
});
