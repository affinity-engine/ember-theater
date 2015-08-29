import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('letter-by-letter', 'Integration | Component | letter by letter', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{letter-by-letter}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#letter-by-letter}}
      template block text
    {{/letter-by-letter}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
