import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';

const { RSVP } = Ember;

moduleForComponent('ember-theater-curtain', 'Unit | Component | ember theater curtain', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true,
  needs: [
    'model:ember-theater-backdrop', 
    'model:ember-theater-character',
    'model:ember-theater-character-expression'
  ]
});

test('`checkForMediaLoadCompletion` triggers `complete` when resources load', function(assert) {
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

test('`imagesLoaded` returns true when all images are loaded', function(assert) {
  const component = this.subject();

  component.get('images').pushObjects([{}, {}, {}]);
  component.get('loadedImages').pushObjects([{}, {}]);

  assert.ok(!component.get('imagesLoaded'), 'if `loadedImages` < `images`, `imagesLoaded` is false');

  component.get('loadedImages').pushObject({});
  assert.ok(component.get('imagesLoaded'), 'if `loadedImages` >= `images`, `imagesLoaded` is true');
});

test('`loadImages` preloads all image files', function(assert) {
  const done = assert.async();
  const component = this.subject({
    emberTheaterBackdrops: Ember.A([{
      src: 'images/backdrops/beach.jpg'
    }]),

    emberTheaterCharacterExpressions: Ember.A([{
      src: 'images/expressions/steven.png'
    }])
  });

  component.loadImages();

  Ember.run.later(() => {
    assert.ok(component.get('emberTheaterBackdrops.firstObject.fileLoaded'), 'backdrops');
    assert.ok(component.get('emberTheaterCharacterExpressions.firstObject.fileLoaded'), 'expressions');
    done();
  }, 50);
});

test('`loadResources` loads all media models on `didInsertElement`', function(assert) {
  const done = assert.async();
  const component = this.subject({
    _modulePrefix: 'dummy'
  });

  this.render();

  Ember.run.later(() => {
    assert.ok(component.get('emberTheaterBackdrops.length') > 0, 'loads backdrops');
    assert.ok(component.get('emberTheaterCharacterExpressions.length') > 0, 'loads expressions');
    done();
  }, 50);
});

test('`moduleNames` returns an array of model names', function(assert) {
  const component = this.subject({
    _modulePrefix: 'dummy'
  });
  const expected = [
    'ember-theater-backdrops',
    'ember-theater-character-expressions',
    'ember-theater-characters'
  ];

  assert.deepEqual(component.get('modelNames'), expected, 'returns all model names');
});
