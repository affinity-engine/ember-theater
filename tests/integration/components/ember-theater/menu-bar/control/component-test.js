import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ember-theater/menu-bar/control', 'Integration | Component | ember theater/menu bar/control', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ember-theater/menu-bar/control}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ember-theater/menu-bar/control}}
      template block text
    {{/ember-theater/menu-bar/control}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
