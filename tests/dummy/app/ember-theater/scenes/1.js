import { Scene } from 'ember-theater';

export default Scene.extend({
  script: async function() {
    await this.choice({ header: '1.choice1.header', choices: { A: { text: { id: '1.choice1.A', options: { opt1: 'OOO' } } }, B: '1.choice1.B' } });
    this.filter({ effect: 'blur(10px)', options: { duration: 50 }, layer: 'theater.text' });
    await this.dialogue({ character: 'steven', text: '1.noId' });
    this.filter({ effect: 'blur(5px)', options: { duration: 500 }, layer: 'theater.text' });
    await this.dialogue({ character: 'steven', displayName: '1.noId', text: { id: '1.firstTest', options: { val1: 'my friend' } } });
    await this.dialogue({ character: 'steven', text: "I was so happy when Garnet said she was gonna come on this trip with me and Dad! (Ruby and Sapphire look at each other and frown) Home's been awful! Here's been awful! I thought you wanted to have a fun time but, everyone's been acting awful too! It-It just came with us! I don't understand! (He looks at the ground) Is it- is it me? I was so happy when Garnet said she was gonna come on this trip with me and Dad! (Ruby and Sapphire look at each other and frown) Home's been awful! Here's been awful! I thought you wanted to have a fun time but, everyone's been acting awful too! It-It just came with us! I don't understand! (He looks at the ground) Is it- is it me?" });
    this.backdrop({ id: 'beach', options: { duration: 500 } });
    this.backdrop({ id: 'beach--night', options: { duration: 5000 } });
    await this.character({ id: 'steven', effect: { translateX: '50vw', opacity: 1 }, options: { duration: 500 } });
    const choiceOne = await this.choice({ header: 'What should I do?', choices: { A: 'Whirl!', B: 'Jump!', C: 'Play Bolero!', D: 'Something', E: 'Filler', F: 'A really long statement, just becuase you know there will be users who have these too. Hell, you will probably create a few of these yourself. You know?', G: 'Here is another short statement.', H: 'Okay, that last one was still kind of long.', I: 'Really actually totally short.', J: 'Okay, really really short.', K: 'Truly short.', L: 'Short and sweet.', M: 'Shorter.', N: 'S' }});
    switch (choiceOne.key) {
      case 'A': await this.character({ id: 'steven', expression: { id: 'steven--jumping', transitionOut: { effect: 'transition.whirlOut', options: { duration: 1000 } }, transitionIn: { effect: 'transition.whirlIn', options: { duration: 1000 } } }}); break;
      case 'B': await this.character({ id: 'steven', effect: 'callout.bounce', options: { duration: 1000 } }); break;
      case 'C': this.sound({ id: 'song__bolero' }); break;
    }
    await this.dialogue({ character: 'steven', text: 'How was that?!' });
    // this.setData('test', 0);
    // this.transitionToScene(2);
  }
});
