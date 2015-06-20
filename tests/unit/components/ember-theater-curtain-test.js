import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';

const { RSVP } = Ember;

moduleForComponent('ember-theater-curtain', 'Unit | Component | ember theater curtain', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true,
  needs: ['model:ember-theater-backdrop', 'model:ember-theater-character-portrait']
});

test('`_loadResources` loads all media models on `didInsertElement`', function(assert) {
  const done = assert.async();
  this.container.register('config:environment', { modulePrefix: 'dummy' });
  const component = this.subject();
  this.render();

  Ember.run.later(() => {
    assert.equal(component.get('emberTheaterBackdrops.length'), 1, 'loads backdrops');
    assert.equal(component.get('emberTheaterCharacterPortraits.length'), 1, 'loads portraits');
    done();
  }, 50);
});

test('`_loadImages` preloads all image files', function(assert) {
  const done = assert.async();
  const component = this.subject({
    emberTheaterBackdrops: Ember.A([{
      src: 'images/backdrops/beach.jpg'
    }]),
    emberTheaterCharacterPortraits: Ember.A([{
      src: 'images/portraits/steven.png'
    }])
  });

  component._loadImages();

  Ember.run.later(() => {
    assert.ok(component.get('emberTheaterBackdrops.firstObject.fileLoaded'), 'preloads backdrops');
    assert.ok(component.get('emberTheaterCharacterPortraits.firstObject.fileLoaded'), 'preloads portraits');
    done();
  }, 50);
});

test('`_checkForImageLoadCompletion` switches `imagesLoaded` when true', function(assert) {
  const component = this.subject();
  component.get('images').pushObjects([{}, {}, {}]);
  component.get('loadedImages').pushObjects([{}, {}]);

  assert.ok(!component.get('imagesLoaded'), 'if `loadedImages` < `images`, `imagesLoaded` is false');

  component.get('loadedImages').pushObject({});
  assert.ok(component.get('imagesLoaded'), 'if `loadedImages` >= `images`, `imagesLoaded` is true');
});

test('`_checkForMediaLoadCompletion` switches `mediaLoaded` when true', function(assert) {
  const component = this.subject();

  assert.ok(!component.get('mediaLoaded'), 'if !`imagesLoaded` is false');

  component.set('imagesLoaded', true);
  assert.ok(component.get('mediaLoaded'), 'if `imagesLoaded` is true');
});
