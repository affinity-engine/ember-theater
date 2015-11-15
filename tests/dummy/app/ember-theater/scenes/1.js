import { Scene } from 'ember-theater';

export default Scene.extend({
  script: async function() {
    // await this.choice('1.choice1.header', { A: { text: { id: '1.choice1.A', options: { opt1: 'OOO' } } }, B: '1.choice1.B' });
    // this.filter('theater.text', ['blur(0px)', 'blur(10px)'], { duration: 1000 });
    // await this.dialogue('steven', '1.noId');
    // this.filter('theater.text', ['blur(10px)', 'blur(0px)'], { duration: 1000, destroy: true });
    // await this.dialogue('steven', '1.noId');
    // await this.dialogue('steven', '1.noId');
    // this.filter('theater.text', 'blur(5px)', { duration: 500 });
    await this.dialogue({ id: 'steven', displayName: '1.noId' }, { id: '1.firstTest', options: { val1: 'my friend' } });
    this.backdrop('beach');
    await this.dialogue('steven', "I was <strong>so happy</strong> when Garnet {speed *.03} said she was gonna come on this trip with me and Dad! {speed 500} (Ruby and Sapphire look at each other and frown) {speed 300} Home's been awful! Here's been awful! I thought you wanted to have a fun time but, everyone's been acting awful too! It-It just came with us! I don't understand! (He looks at the ground) Is it- is it me?");
    // this.filter('theater.text', 'blur(0)', { duration: 500 });
    this.backdrop('beach--night', { duration: 5000 });
    await this.character('steven', { translateX: '50vw', opacity: 1 }, { duration: 500 });
    const choiceOne = await this.choice('What should I do?', { A: 'Whirl!', B: 'Jump!', C: 'Play Bolero!', D: 'Something', E: 'Filler', F: 'A really long statement, just becuase you know there will be users who have these too. Hell, you will probably create a few of these yourself. You know?', G: 'Here is another short statement.', H: 'Okay, that last one was still kind of long.', I: 'Really actually totally short.', J: 'Okay, really really short.', K: 'Truly short.', L: 'Short and sweet.', M: 'Shorter.', N: 'S' });
    switch (choiceOne.key) {
      case 'A': await this.expression('steven', 'steven--jumping', { effect: 'transition.whirlIn', options: { duration: 1000 } }, { effect: 'transition.whirlOut', options: { duration: 1000 } }); break;
      case 'B': await this.character('steven', 'callout.bounce', { duration: 1000 }); break;
      case 'C': this.sound('song__bolero'); break;
    }
    await this.dialogue('steven', 'How was that?!');
    // this.setData('test', 0);
    // this.transitionToScene(2);
  }
});
