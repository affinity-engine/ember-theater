import { Scene } from 'ember-theater/ember-theater/director';
import step from 'ember-theater/ember-theater/director/test-support/step';

export default Scene.extend({
  name: 'Character Direction Test',

  start: async function(script) {
    const bitsy = script.Character('bitsy');

    await step(script);
    bitsy.transition({ opacity: 0.2 });

    await step(script);
    await bitsy.transition({ opacity: 0.3 }).transition({ opacity: 0.4 }).transition({ opacity: 0.5 });

    await step(script);
    const bitsy2 = await script.Character('bitsy');

    await step(script);
    await bitsy2.transition({ opacity: 0.6 });

    await step(script);
    await script.Character('emma');

    await step(script);
    await script.Character({
      id: 'bobo',
      name: 'Bobo',
      height: 90,
      defaultExpression: 'emma-neutral'
    });

    await step(script);
    const bitsy3 = await script.Character('bitsy').position('center');

    await step(script);
    await bitsy3.position('left nudgeDown');

    await step(script);
    await script.Character('bitsy').initialExpression('bitsy-happy').position('center');
  }
});
