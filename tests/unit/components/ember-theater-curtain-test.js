import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';

const { RSVP } = Ember;

moduleForComponent('ember-theater-curtain', 'Unit | Component | ember theater curtain', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('`_loadResources` loads all media models on `didInsertElement`', function(assert) {
  const done = assert.async();
  const component = this.subject();
  component.set('store', {
    find(type) {
      return new RSVP.Promise((resolve) => {
        const models = [1, 2, 3].map((id) => {
          return { id: id, type: type };
        });
        resolve(Ember.A(models));
      });
    }
  });
  this.render();

  Ember.run.later(() => {
    assert.equal(component.get('backdrops.length'), 3, 'loads backdrops');
    assert.equal(component.get('portraits.length'), 3, 'loads portraits');
    done();
  }, 50);
});

test('`_loadImages` preloads all image files', function(assert) {
  const done = assert.async();
  const component = this.subject({
    backdrops: Ember.A([{
      src: 'images/backdrops/beach.jpg'
    }]),
    portraits: Ember.A([{
      src: 'images/portraits/steven.png'
    }])
  });

  component._loadImages();

  Ember.run.later(() => {
    assert.ok(component.get('backdrops.firstObject.fileLoaded'), 'preloads backdrops');
    assert.ok(component.get('portraits.firstObject.fileLoaded'), 'preloads portraits');
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
