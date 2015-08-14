import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('ember-theater-directable-pause', 'Integration | Component | ember theater directable pause', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ember-theater-directable-pause}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#ember-theater-directable-pause}}
      template block text
    {{/ember-theater-directable-pause}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
