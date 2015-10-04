import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ember-theater/menu-bar/confirm', 'Integration | Component | ember theater/menu bar/confirm', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ember-theater/menu-bar/confirm}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ember-theater/menu-bar/confirm}}
      template block text
    {{/ember-theater/menu-bar/confirm}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
