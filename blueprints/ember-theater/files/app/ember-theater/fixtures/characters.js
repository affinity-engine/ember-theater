/*
  @property id {String} The id by which you'll reference this character. Not necessarily the same as the character's name.
  @property name {String} The character's name. It is to be used wherever the character is referenced to the user.
  @property height {Number} The character's height. What percentage of the screen height is fills.
  @property defaultExpression {String} The id of the expression that this character will use by default.
  @property expressions {Object} Key/value aliases for the character's expressions.

  Example:

  {
    id: 'bitsy',
    name: 'Bitsy',
    height: 60,
    defaultExpression: 'neutral',
    expressions: {
      neutral: 'bitsy-neutral',
      happy: 'bitsy-happy',
      angry: 'bitsy-angry'
    }
  }
*/

export default [];
