import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';

const { RSVP } = Ember;

moduleForComponent('ember-theater-curtain', 'Unit | Component | ember theater curtain', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true,
  needs: ['model:ember-theater-backdrop', 'model:ember-theater-character-portrait',
    'model:ember-theater-character']
});

test('`moduleNames` returns an array of model names found under ember-theater-fixtures', function(assert) {
  const component = this.subject({
    _modulePrefix: 'dummy'
  });
  assert.deepEqual(
    component.get('modelNames'),
      ['ember-theater-backdrops',
      'ember-theater-character-portraits',
      'ember-theater-characters'],
    'returns all model names'
  );
});

test('`loadResources` loads all media models on `didInsertElement`', function(assert) {
  const done = assert.async();
  const component = this.subject({
    _modulePrefix: 'dummy'
  });
  this.render();

  Ember.run.later(() => {
    assert.ok(component.get('emberTheaterBackdrops.length') > 0, 'loads backdrops');
    assert.ok(component.get('emberTheaterCharacterPortraits.length') > 0, 'loads portraits');
    done();
  }, 50);
});

test('`loadImages` preloads all image files', function(assert) {
  const done = assert.async();
  const component = this.subject({
    emberTheaterBackdrops: Ember.A([{
      src: 'images/backdrops/beach.jpg'
    }]),
    emberTheaterCharacterPortraits: Ember.A([{
      src: 'images/portraits/steven.png'
    }])
  });

  component.loadImages();

  Ember.run.later(() => {
    assert.ok(component.get('emberTheaterBackdrops.firstObject.fileLoaded'), 'preloads backdrops');
    assert.ok(component.get('emberTheaterCharacterPortraits.firstObject.fileLoaded'), 'preloads portraits');
    done();
  }, 50);
});

test('`imagesLoaded` returns true when all images are loaded', function(assert) {
  const component = this.subject();
  component.get('images').pushObjects([{}, {}, {}]);
  component.get('loadedImages').pushObjects([{}, {}]);

  assert.ok(!component.get('imagesLoaded'), 'if `loadedImages` < `images`, `imagesLoaded` is false');

  component.get('loadedImages').pushObject({});
  assert.ok(component.get('imagesLoaded'), 'if `loadedImages` >= `images`, `imagesLoaded` is true');
});

test('`checkForMediaLoadCompletion` triggers `complete` when all resources are loaded', function(assert) {
  assert.expect(1);
  const component = this.subject({
    attrs: {
      complete() {
        assert.ok(true, 'triggers complete');
      }
    }
  });

  component.set('imagesLoaded', true);
  component.checkForMediaLoadCompletion();
});
