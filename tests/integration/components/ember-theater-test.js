import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { $hook, initialize as initializeHook } from 'ember-hook';
import { initialize as initializeMultiton } from 'ember-multiton-service';

const { getOwner } = Ember;
const { run: { later } } = Ember;

moduleForComponent('ember-theater', 'Integration | Component | ember theater', {
  integration: true,

  beforeEach() {
    initializeHook();
    initializeMultiton(getOwner(this));
  }
});

test('`theaterId` defaults to `ember-theater-default`', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{#ember-theater as |theater|}}
      <div data-test={{hook "theater_id"}}>{{theater.theaterId}}</div>
    {{/ember-theater}}
  `);

  assert.equal($hook('theater_id').text().trim(), 'ember-theater-default', '`theaterId` has correct default');
});

test('`theaterId` can be passed in', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{#ember-theater theaterId="foo" as |theater|}}
      <div data-test={{hook "theater_id"}}>{{theater.theaterId}}</div>
    {{/ember-theater}}
  `);

  assert.equal($hook('theater_id').text().trim(), 'foo', '`theaterId` is correctly set');
});

test('`config` is passed to the `configService` on init', function(assert) {
  assert.expect(1);

  const config = { };

  const configService = Ember.Object.create({
    initializeConfig(arg) {
      assert.equal(arg, config, '`config` matches the initializeConfig argument');
    }
  });

  this.setProperties({
    config,
    configService
  });

  this.render(hbs`{{ember-theater configService=configService config=config}}`);
});

test('`fixtures` are loaded into the `fixtureStore` on init', function(assert) {
  assert.expect(4);

  const fixtures = {
    foo: 1,
    bar: 'A',
    baz: ['Z', 10],
    bal: { }
  };

  const fixtureStore = Ember.Object.create({
    add(key, value) {
      assert.equal(value, fixtures[key], `fixture ${key} is correct`);
    }
  });

  this.setProperties({
    fixtures,
    fixtureStore
  });

  this.render(hbs`{{ember-theater fixtureStore=fixtureStore fixtures=fixtures}}`);
});

test('`destroyMultitons` triggers `multitonManager` on destroy', function(assert) {
  assert.expect(1);

  const theaterId = 'foo';

  const multitonManager = Ember.Object.create({
    removeServices(arg) {
      assert.equal(arg, theaterId, '`removeServices` recieves the `theaterId`');
    }
  });

  this.setProperties({
    multitonManager,
    theaterId,
    visible: true
  });

  this.render(hbs`
    {{#if visible}}
      {{ember-theater multitonManager=multitonManager theaterId=theaterId}}
    {{/if}}
  `);

  this.set('visible', false);
});

test('`isFocused` is set by the `focus` event', function(assert) {
  assert.expect(3);

  const done = assert.async();
  const producer = Ember.Object.create({ isFocused: false });

  this.set('producer', producer);

  this.render(hbs`{{ember-theater producer=producer}}`);

  assert.equal(producer.get('isFocused'), false, '`isFocused` defaults to the producer value');

  $hook('ember_theater').focus();

  assert.equal(producer.get('isFocused'), false, '`isFocused` is not immediately set');

  later(() => {
    assert.equal(producer.get('isFocused'), true, '`isFocused` is correctly set after delay');

    done();
  }, 150);
});

test('`isFocused` is lost by the `focus` event', function(assert) {
  assert.expect(3);

  const done = assert.async();
  const producer = Ember.Object.create({ isFocused: false });

  this.set('producer', producer);

  this.render(hbs`{{ember-theater producer=producer isFocused=true}}`);

  assert.equal(producer.get('isFocused'), true, '`isFocused` can be passed in');

  $hook('ember_theater').blur();

  assert.equal(producer.get('isFocused'), true, '`isFocused` is not immediately changed');

  later(() => {
    assert.equal(producer.get('isFocused'), false, '`isFocused` is correctly blurred after delay');

    done();
  }, 150);
});

test('`completePreload` sets `isLoaded` to true', function(assert) {
  assert.expect(3);

  this.render(hbs`
    {{#ember-theater as |theater|}}
      <button {{action theater.completePreload}} data-test={{hook "complete_preload"}}>{{theater.isLoaded}}</button>
    {{/ember-theater}}
  `);

  assert.equal($hook('complete_preload').text().trim(), '', '`isLoaded` defaults to undefined');

  $hook('complete_preload').click();

  assert.equal($hook('complete_preload').text().trim(), 'true', '`isLoaded` changed to true');

  $hook('complete_preload').click();

  assert.equal($hook('complete_preload').text().trim(), 'true', '`isLoaded` remained to true');
});
