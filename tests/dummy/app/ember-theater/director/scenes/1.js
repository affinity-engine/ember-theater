import { Scene } from 'ember-theater/ember-theater/director';

export default Scene.extend({
  name: 'The Beach',

  script: async function() {
    const value = await this.CodeChallenge([{ code: 'let two = 1 + 1;', readOnly: true }, { }, { code: 'return two;', readOnly: true }]);

    console.log(value);

    this.Sound('song__bolero').fadeIn();
    await this.Pause(1000);
    this.Sound('song__bolero').fadeOut();

    await this.Character('steven').initialExpression('steven--jumping').transition({ left: '50%' }, 5000, { loop: 3 }).name('Tiger').Text('Hello! I have a lot to say, so please listen up! Hahahahahahahaha!').transitionIn({ opacity: [1, 0], left: [0, '-100vw'] }).keys(['a']).classNames({ name: 'et-right' });
    await this.Text('Bye!');
    await this.Character('steven').Expression('steven');
    await this.Character('steven').Text('How was that?');

    await this.Backdrop('beach');
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
