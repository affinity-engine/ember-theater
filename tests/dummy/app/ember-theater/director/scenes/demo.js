import { Scene } from 'ember-theater/ember-theater/director';

export default Scene.extend({
  name: 'Ember Theater Demo',

  script: async function() {
    // const value = await this.CodeChallenge([{ code: 'let two = 1 + 1;', readOnly: true }, { }, { code: 'return two;', readOnly: true }]);
    //
    // console.log(value);

    this.Sound('song__bolero').fadeIn();
    await this.Pause(1000);
    this.Sound('song__bolero').fadeOut();

    await this.Character('bebe').initialExpression('bebe-blush').transition({ left: '50%' }, 5000, { loop: 3 }).name('Bebe?').Text('Hello! I have a lot to say, so please listen up! Hahahahahahahaha!').transitionIn({ opacity: [1, 0], left: [0, '-100vw'] }).keys(['a', ' ']).classNames({ name: 'et-right' });
    await this.Character('bebe').initialExpression('bebe-panic').instance(1).transition({ left: '25%' });
    await this.Text('Bye!');
    await this.Character('bebe').Expression('bebe-neutral');
    await this.Character('bebe').Text('How was that?');

    await this.Backdrop('classroom');
    this.Filter('theater.stage', ['blur(0px)', 'blur(10px)'], 1000);
    await this.Text('Hello!');
    this.Filter('theater.stage', ['blur(10px)', 'blur(0px)'], 1000).destroy();
    await this.Text('Bye!');

    const choice = await this.Choice(['A', 'B', 'C']);

    console.log(choice);

    this.Text('Hello!');
    await this.Pause(500);
    await this.Text('Bye!');

    this.SetData('foo', 'bar');
    console.log(await this.GetData('foo'));
    this.DeleteData('foo');
    console.log(await this.DeleteData('foo'));

    console.log('Entered Scene');

    await this.TransitionToScene('1').transitionOut('transition.whirlOut', 1000);

    console.log('Left Scene');
  }
});
